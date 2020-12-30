const { getTipCollection } = require("../../mongo");
const { extractPage } = require("../../utils");
const { normalizeTip } = require("./utils");

class TipsController {
  async getTips(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const tipCol = await getTipCollection();
    const tips = await tipCol
      .find({}, { timeline: 0 })
      .sort({
        isClosedOrRetracted: 1,
        "indexer.blockHeight": -1,
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
    const total = await tipCol.estimatedDocumentCount();

    ctx.body = {
      items: tips.map(normalizeTip),
      page,
      pageSize,
      total,
    };
  }

  async getTipsCount(ctx) {
    const tipCol = await getTipCollection();
    const tipsCount = await tipCol.estimatedDocumentCount();
    ctx.body = tipsCount;
  }

  async getTipDetail(ctx) {
    const { blockHeight, tipHash } = ctx.params;

    const tipCol = await getTipCollection();
    const tip = await tipCol.findOne({
      hash: tipHash,
      'indexer.blockHeight': parseInt(blockHeight),
    });

    if (!tip) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      hash: tip.hash,
      proposeTime: tip.indexer.blockTime,
      proposeAtBlockHeight: tip.indexer.blockHeight,
      beneficiary: tip.meta?.who,
      finder: tip.finder,
      reason: tip.reason,
      latestState: {
        state: tip.state?.state,
        time: tip.state?.indexer.blockTime,
        blockHeight: tip.state?.indexer.blockHeight,
      },
      tipsCount: tip.meta?.tips.length,
      medianValue: tip.medianValue,
      tippersCount: tip.tippersCount,
      closeFromBlockHeight: tip.meta?.closes,
      timeline: tip.timeline,
    };
  }

  async getTipTimeline(ctx) {
    const { blockHeight, tipHash } = ctx.params;

    ctx.status = 404;
    return;
  }
}

module.exports = new TipsController();
