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
      .find({})
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
    const { hash } = ctx.params;

    const tipCol = await getTipCollection();
    const tip = await tipCol.findOne({ hash });

    if (!tip) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      hash: tip.hash,
      proposeTime: tip.indexer.blockTime,
      beneficiary: tip.meta?.who,
      finder: Array.isArray(tip.meta?.finder)
        ? tip.meta.finder[0]
        : tip.meta?.finder ?? tip.signer,
      reason: tip.meta?.reasonText,
      latestState: {
        state: tip.state?.state,
        time: tip.state?.indexer.blockTime,
        blockHeight: tip.state?.indexer.blockHeight,
      },
      tips: tip.meta?.tips,
      medianValue: tip.medianValue,
      tippers: tip.meta?.tippers,
      ...(tip.meta?.closes
        ? {
            closeAtBlockHeight: tip.meta.closes,
            countdownFromBlockHeight: tip.meta.closes - tip.meta.tipCountdown,
          }
        : {}),
    };
  }
}

module.exports = new TipsController();
