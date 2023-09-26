const { getBurntCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

class BurntController {
  async getBurntList(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const burntCol = await getBurntCollection();
    const burntList = await burntCol
      .find({})
      .sort({
        "indexer.blockHeight": -1,
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
    const total = await burntCol.estimatedDocumentCount();

    ctx.body = {
      items: burntList,
      page,
      pageSize,
      total,
    };
  }

  async getBurntCount(ctx) {
    const burntCol = await getBurntCollection();
    const burntCount = await burntCol.estimatedDocumentCount();
    ctx.body = burntCount;
  }

  async getBurntDataForChart(ctx) {
    const burntCol = await getBurntCollection();
    const burntList = await burntCol
      .aggregate([
        {
          $sort: { "indexer.blockHeight": -1 },
        },
        {
          $project: {
            _id: 0,
            timestamp: "$indexer.blockTime",
            amount: "$balance",
          },
        },
      ])
      .toArray();
    ctx.body = burntList;
  }
}

module.exports = new BurntController();
