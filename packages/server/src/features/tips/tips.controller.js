const { getTipCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

class TipsController {
  async getTips(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const tipCol = await getTipCollection();
    const tips = await tipCol
      .find({})
      .sort({ "indexer.blockHeight": -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
    const total = await tipCol.estimatedDocumentCount();

    ctx.body = {
      items: tips.map((tip) => ({
        hash: tip.hash,
        proposeTime: tip.indexer.blockTime,
        beneficiary: tip.meta?.who,
        finder: Array.isArray(tip.meta?.finder)
          ? tip.meta.finder[0]
          : tip.meta?.finder,
        reason: tip.meta?.reason,
        latestState: {
          state: tip.state?.state,
          time: tip.state?.indexer.blockTime,
        },
        tipsCount: tip.meta?.tips.length,
        medianValue: tip.medianValue,
      })),
      page,
      pageSize,
      total,
    };
  }
}

module.exports = new TipsController();
