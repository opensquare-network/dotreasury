const { getBountyCollection, getMotionCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

const bountyStatus = (bounty) => bounty.status?.CuratorProposed || bounty.status?.Active || bounty.status?.PendingPayout;

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
      items: bounties.map(item => ({
        bountyIndex: item.bountyIndex,
        curator: bountyStatus(item.meta)?.curator,
        beneficiary: bountyStatus(item.meta)?.beneficiary,
        title: item.description,
        value: item.meta?.value,
        latestState: {
          state: item.state?.name,
          indexer: item.state?.indexer || item.state?.eventIndexer,
        }
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
    const bountyMotions = await motionCol.find({ treasuryBountyId: bountyIndex }).sort({ index: 1 }).toArray();

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
      curator: bountyStatus(bounty.meta)?.curator,
      beneficiary: bountyStatus(bounty.meta)?.beneficiary,
      title: bounty.description,
      value: bounty.meta?.value,
      latestState: {
        state: bounty.state?.name,
        indexer: bounty.state?.indexer || bounty.state?.eventIndexer,
        data: bounty.state?.data,
      },
      timeline: bounty.timeline,
      motions: bountyMotions,
    };
  }
}

module.exports = new BountiesController();
