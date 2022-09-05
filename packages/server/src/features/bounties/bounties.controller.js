const { getBountyCollection, getMotionCollection } = require("../../mongo");
const { extractPage } = require("../../utils");
const linkService = require("../../services/link.service");
const commentService = require("../../services/comment.service");
const { HttpError } = require("../../exc");

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
});

async function getAdmins(chain, bountyIndex) {
  const col = await getBountyCollection(chain);
  const bounty = await col.findOne({ bountyIndex });
  owner = bounty?.meta?.proposer;

  return [...ADMINS, owner];
}

class BountiesController {
  async getBounties(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const bountyCol = await getBountyCollection(chain);
    const bounties = await bountyCol
      .aggregate([
        {
          $sort: {
            stateSort: 1,
            "indexer.blockHeight": -1,
          }
        },
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
                  }
                }
              },
              { $sort: { index: -1 } }
            ],
            as: "childBounties",
          }
        },
        {
          $project: {
            timeline: 0,
            "childBounties.timeline": 0,
          }
        }
      ]).toArray();
    const total = await bountyCol.estimatedDocumentCount();

    ctx.body = {
      items: bounties.map(item => ({
        ...normalizeBountyListItem(item),
        childBounties: item.childBounties,
      })),
      page,
      pageSize,
      total,
    };
  }

  async getBountyDetail(ctx) {
    const { chain } = ctx.params;
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    const bountyCol = await getBountyCollection(chain);
    const bounty = await bountyCol.findOne({ bountyIndex });
    if (!bounty) {
      ctx.status = 404;
      return;
    }

    const motionHashes = (bounty.motions || []).map(motionInfo => motionInfo.hash);

    const motionCol = await getMotionCollection(chain);
    const bountyMotions = await motionCol
      .find({ hash: { $in: motionHashes } })
      .sort({ index: 1 })
      .toArray();

    const motions = (bounty.motions || []).map(motionInfo => {
      const targetMotion = (bountyMotions || []).find(
        m => m.hash === motionInfo.hash &&
          m.indexer.blockHeight === motionInfo.indexer.blockHeight
      )

      return {
        motionInfo,
        ...targetMotion,
      }
    })

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
    const { chain } = ctx.params;
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.body = await linkService.getLinks({
      indexer: {
        chain,
        type: "bounty",
        index: bountyIndex,
      },
    });
  }

  async createBountyLink(ctx) {
    const { chain } = ctx.params;
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const { link, description } = ctx.request.body;

    const admins = await getAdmins(chain, bountyIndex);

    ctx.body = await linkService.createLink(
      {
        indexer: {
          chain,
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
    const { chain } = ctx.params;
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const linkIndex = parseInt(ctx.params.linkIndex);

    const admins = await getAdmins(chain, bountyIndex);

    ctx.body = await linkService.deleteLink(
      {
        indexer: {
          chain,
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
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.body = await commentService.getComments(
      {
        chain,
        type: "bounty",
        index: bountyIndex,
      },
      page,
      pageSize,
      ctx.request.user
    );
  }

  async postBountyComment(ctx) {
    const { chain } = ctx.params;
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }

    const bountyCol = await getBountyCollection(chain);
    const bounty = await bountyCol.findOne({ bountyIndex });
    if (!bounty) {
      throw new HttpError(404, "Bounty not found");
    }

    ctx.body = await commentService.postComment(
      {
        chain,
        type: "bounty",
        index: bountyIndex,
      },
      content,
      user
    );
  }
}

module.exports = new BountiesController();
