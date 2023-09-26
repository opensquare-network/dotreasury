const { getOutputTransferCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

class OutputTransferController {
  async getOutputTransfers(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getOutputTransferCollection();
    const items = await col
      .find({})
      .sort({
        "indexer.blockHeight": -1,
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
    const total = await col.estimatedDocumentCount();

    ctx.body = {
      items,
      page,
      pageSize,
      total,
    };
  }

  async getOutputTransfersCount(ctx) {
    const col = await getOutputTransferCollection();
    const count = await col.estimatedDocumentCount();
    ctx.body = count;
  }
}

module.exports = new OutputTransferController();
