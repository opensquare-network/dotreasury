const { getBountyCollection, getMotionCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

const bountyStatus = (bounty) => bounty.status?.CuratorProposed || bounty.status?.Active || bounty.status?.PendingPayout;
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
      items: bounties.map(item => ({
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
}

module.exports = new BountiesController();
