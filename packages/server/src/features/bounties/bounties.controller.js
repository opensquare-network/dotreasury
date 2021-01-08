const { getBountyCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

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
        curator: item.meta?.status?.Active?.curator,
        beneficiary: null, // TODO: there are no available beneficiary at present.
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

    ctx.status = 404;
  }
}

module.exports = new BountiesController();
