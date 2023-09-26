const { getBountyCollection, getMotionCollection } = require("../../mongo");
const { extractPage } = require("../../utils");
const linkService = require("../../services/link.service");
const commentService = require("../../services/comment.service");
const { HttpError } = require("../../exc");
const { BountyQueryFieldsMap } = require("../common/query");
const { getRangeCondition } = require("../common/getRangeCondition");

const bountyStatus = (bounty) =>
  bounty?.status?.CuratorProposed ||
  bounty?.status?.curatorProposed ||
  bounty?.status?.Active ||
  bounty?.status?.active ||
  bounty?.status?.PendingPayout ||
  bounty?.status?.pendingPayout;

const bountyStatusName = (bounty) => {
  if (bounty.state?.state === "BountyRejected") {
    return "Rejected";
  } else if (bounty.state?.state === "BountyCanceled") {
    return "Canceled";
  } else if (bounty.state?.state === "BountyClaimed") {
    return "Claimed";
  }

  return Object.keys(bounty.meta.status)[0];
};

const normalizeBountyListItem = (item) => ({
  bountyIndex: item.bountyIndex,
  proposeTime: item.indexer.blockTime,
  proposeAtBlockHeight: item.indexer.blockHeight,
  curator: bountyStatus(item.meta)?.curator,
  updateDue: bountyStatus(item.meta)?.updateDue,
  beneficiary: bountyStatus(item.meta)?.beneficiary,
  unlockAt: bountyStatus(item.meta)?.unlockAt,
  title: item.description,
  value: item.meta?.value,
  symbolPrice: item.symbolPrice,
  state: item.state,
  latestState: {
    state: bountyStatusName(item),
    indexer: item.state?.indexer || item.state?.eventIndexer,
  },
  dValue: item.dValue?.toString(),
  fiatValue: item.fiatValue,
});

async function getAdmins(bountyIndex) {
  const col = await getBountyCollection();
  const bounty = await col.findOne({ bountyIndex });
  const owner = bounty?.meta?.proposer;

  return [...ADMINS, owner];
}

function getCondition(ctx) {
  const { status, beneficiary, proposer } = ctx.request.query;

  const condition = {};
  if (beneficiary) {
    condition["meta.status.pendingPayout.beneficiary"] = beneficiary;
  }

  if (proposer) {
    condition["meta.proposer"] = proposer;
  }

  if (status) {
    condition["state.state"] = { $in: status.split("||") };
  }

  const rangeCond = getRangeCondition(ctx);

  return { ...condition, ...rangeCond };
}

class BountiesController {
  async getBounties(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    let sortPipeline = [
      {
        $sort: {
          stateSort: 1,
          "indexer.blockHeight": -1,
        },
      },
    ];

    const { sort } = ctx.request.query;
    if (sort) {
      let [fieldName, sortDirection] = sort.split("_");
      fieldName = BountyQueryFieldsMap[fieldName];
      if (!fieldName) {
        throw new HttpError(400, "Invalid sort field");
      }
      sortPipeline = [
        {
          $sort: {
            [fieldName]: sortDirection === "desc" ? -1 : 1,
            "indexer.blockHeight": -1,
          },
        },
      ];
    }

    const condition = getCondition(ctx);
    const bountyCol = await getBountyCollection();
    const bounties = await bountyCol
      .aggregate([
        { $match: condition },
        ...sortPipeline,
        { $skip: pageSize * page },
        { $limit: pageSize },
        {
          $lookup: {
            from: "childBounty",
            let: { bountyIndex: "$bountyIndex" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$parentBountyId", "$$bountyIndex"],
                  },
                },
              },
              {
                $project: { timeline: 0 },
              },
              { $sort: { index: -1 } },
            ],
            as: "childBounties",
          },
        },
        {
          $project: { timeline: 0 },
        },
      ])
      .toArray();
    const total = await bountyCol.countDocuments(condition);

    ctx.body = {
      items: bounties.map((item) => ({
        ...normalizeBountyListItem(item),
        childBounties: item.childBounties,
      })),
      page,
      pageSize,
      total,
    };
  }

  async getBountyDetail(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    const bountyCol = await getBountyCollection();
    const bounty = await bountyCol.findOne({ bountyIndex });
    if (!bounty) {
      ctx.status = 404;
      return;
    }

    const motionHashes = (bounty.motions || []).map(
      (motionInfo) => motionInfo.hash,
    );

    const motionCol = await getMotionCollection();
    const bountyMotions = await motionCol
      .find({ hash: { $in: motionHashes } })
      .sort({ index: 1 })
      .toArray();

    const motions = (bounty.motions || []).map((motionInfo) => {
      const targetMotion = (bountyMotions || []).find(
        (m) =>
          m.hash === motionInfo.hash &&
          m.indexer.blockHeight === motionInfo.indexer.blockHeight,
      );

      return {
        motionInfo,
        ...targetMotion,
      };
    });

    ctx.body = {
      bountyIndex: bounty.bountyIndex,
      indexer: bounty.indexer,
      proposeTime: bounty.indexer.blockTime,
      proposeAtBlockHeight: bounty.indexer.blockHeight,
      proposer: bounty.meta?.proposer,
      bond: bounty.meta?.bond,
      fee: bounty.meta?.fee,
      curatorDeposit: bounty.meta?.curatorDeposit,
      curator: bountyStatus(bounty.meta)?.curator,
      updateDue: bountyStatus(bounty.meta)?.updateDue,
      beneficiary: bountyStatus(bounty.meta)?.beneficiary,
      unlockAt: bountyStatus(bounty.meta)?.unlockAt,
      title: bounty.description,
      value: bounty.meta?.value,
      symbolPrice: bounty.symbolPrice,
      state: bounty.state,
      latestState: {
        state: bountyStatusName(bounty),
        indexer: bounty.state?.indexer || bounty.state?.eventIndexer,
        data: bounty.state?.data,
      },
      timeline: bounty.timeline,
      motions,
    };
  }

  async getBountyLinks(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.body = await linkService.getLinks({
      indexer: {
        chain: process.env.CHAIN,
        type: "bounty",
        index: bountyIndex,
      },
    });
  }

  async createBountyLink(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const { link, description } = ctx.request.body;

    const admins = await getAdmins(bountyIndex);

    ctx.body = await linkService.createLink(
      {
        indexer: {
          chain: process.env.CHAIN,
          type: "bounty",
          index: bountyIndex,
        },
        link,
        description,
      },
      ctx.request.headers.signature,
      admins,
    );
  }

  async deleteBountyLink(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const linkIndex = parseInt(ctx.params.linkIndex);

    const admins = await getAdmins(bountyIndex);

    ctx.body = await linkService.deleteLink(
      {
        indexer: {
          chain: process.env.CHAIN,
          type: "bounty",
          index: bountyIndex,
        },
        linkIndex,
      },
      ctx.request.headers.signature,
      admins,
    );
  }

  // Comments API
  async getBountyComments(ctx) {
    const { page, pageSize } = extractPage(ctx);
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.body = await commentService.getComments(
      {
        chain: process.env.CHAIN,
        type: "bounty",
        index: bountyIndex,
      },
      page,
      pageSize,
    );
  }
}

module.exports = new BountiesController();
