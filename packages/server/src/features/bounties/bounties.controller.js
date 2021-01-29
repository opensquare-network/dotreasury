const { getBountyCollection, getMotionCollection } = require("../../mongo");
const { extractPage } = require("../../utils");
const linkService = require("../../services/link.service");
const commentService = require("../../services/comment.service");

const bountyStatus = (bounty) =>
  bounty.status?.CuratorProposed ||
  bounty.status?.Active ||
  bounty.status?.PendingPayout;
const bountyStatusName = (bounty) => Object.keys(bounty.status)[0];

class BountiesController {
  async getBounties(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const bountyCol = await getBountyCollection();
    const bounties = await bountyCol
      .find({}, { timeline: 0 })
      .sort({
        "indexer.blockHeight": -1,
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
    const total = await bountyCol.estimatedDocumentCount();

    ctx.body = {
      items: bounties.map((item) => ({
        bountyIndex: item.bountyIndex,
        proposeTime: item.indexer.blockTime,
        proposeAtBlockHeight: item.indexer.blockHeight,
        curator: bountyStatus(item.meta)?.curator,
        updateDue: item.meta?.status.Active?.updateDue,
        beneficiary: bountyStatus(item.meta)?.beneficiary,
        unlockAt: item.meta?.status.PendingPayout?.unlockAt,
        title: item.description,
        value: item.meta?.value,
        latestState: {
          state: bountyStatusName(item.meta) || item.state?.name,
          indexer: item.state?.indexer || item.state?.eventIndexer,
        },
      })),
      page,
      pageSize,
      total,
    };
  }

  async getBountiesCount(ctx) {
    const bountyCol = await getBountyCollection();
    const total = await bountyCol.estimatedDocumentCount();
    ctx.body = total;
  }

  async getBountyDetail(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    const bountyCol = await getBountyCollection();
    const bounty = await bountyCol.findOne({ bountyIndex });

    const motionCol = await getMotionCollection();
    const bountyMotions = await motionCol
      .find({ treasuryBountyId: bountyIndex })
      .sort({ index: 1 })
      .toArray();

    if (!bounty) {
      ctx.status = 404;
      return;
    }

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
      updateDue: bounty.meta?.status.Active?.updateDue,
      beneficiary: bountyStatus(bounty.meta)?.beneficiary,
      unlockAt: bounty.meta?.status.PendingPayout?.unlockAt,
      title: bounty.description,
      value: bounty.meta?.value,
      latestState: {
        state: bountyStatusName(bounty.meta) || bounty.state?.name,
        indexer: bounty.state?.indexer || bounty.state?.eventIndexer,
        data: bounty.state?.data,
      },
      timeline: bounty.timeline,
      motions: bountyMotions,
    };
  }

  async getBountyLinks(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.body = await linkService.getLinks({
      type: "bounties",
      indexer: bountyIndex,
    });
  }

  async createBountyLink(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const { link, description } = ctx.request.body;

    ctx.body = await linkService.createLink(
      {
        type: "bounties",
        indexer: bountyIndex,
        link,
        description,
      },
      ctx.request.headers.signature
    );
  }

  async deleteBountyLink(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const linkIndex = parseInt(ctx.params.linkIndex);

    ctx.body = await linkService.deleteLink(
      {
        type: "bounties",
        indexer: bountyIndex,
        linkIndex,
      },
      ctx.request.headers.signature
    );
  }

  // Comments API
  async getBountyComments(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);

    ctx.body = await commentService.getComments({
      treasuryBountyId: bountyIndex,
    });
  }

  async postBountyComment(ctx) {
    const bountyIndex = parseInt(ctx.params.bountyIndex);
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }

    const bountyCol = await getBountyCollection();
    const bounty = await bountyCol.findOne({ bountyIndex });
    if (!bounty) {
      throw new HttpError(404, "Bounty not found");
    }

    ctx.body = await commentService.postComment(
      { treasuryBountyId: bountyIndex },
      content,
      user
    );
  }
}

module.exports = new BountiesController();
