const { getOutputTransferCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

class OutputTransferController {
  async getOutputTransfers(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getOutputTransferCollection(chain);
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
    const { chain } = ctx.params;
    const col = await getOutputTransferCollection(chain);
    const count = await col.estimatedDocumentCount();
    ctx.body = count;
  }
}

module.exports = new OutputTransferController();
