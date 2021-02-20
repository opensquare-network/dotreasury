const { getTipCollection } = require("../../mongo");
const linkService = require("../../services/link.services");
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
      "indexer.blockHeight": parseInt(blockHeight),
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
      tipFindersFee: tip.tipFindersFee,
      closeFromBlockHeight: tip.meta?.closes,
      timeline: tip.timeline,
    };
  }

  async getTipLinks(ctx) {
    const tipHash = ctx.params.tipHash;
    const blockHeight = parseInt(ctx.params.blockHeight);

    ctx.body = await linkService.getLinks({
      type: "tips",
      indexer: {
        blockHeight,
        tipHash,
      },
      getReason: async () => {
        const tipCol = await getTipCollection();
        const tip = await tipCol.findOne({
          hash: tipHash,
          "indexer.blockHeight": blockHeight,
        });
        return tip?.reason;
      },
    });
  }

  async createTipLink(ctx) {
    const tipHash = ctx.params.tipHash;
    const blockHeight = parseInt(ctx.params.blockHeight);

    const { link, description } = ctx.request.body;

    ctx.body = await linkService.createLink(
      {
        type: "tips",
        indexer: {
          blockHeight,
          tipHash,
        },
        link,
        description,
      },
      ctx.request.headers.signature
    );
  }

  async deleteTipLink(ctx) {
    const { tipHash } = ctx.params;
    const blockHeight = parseInt(ctx.params.blockHeight);
    const linkIndex = parseInt(ctx.params.linkIndex);

    ctx.body = await linkService.deleteLink(
      {
        type: "tips",
        indexer: {
          blockHeight,
          tipHash,
        },
        linkIndex,
      },
      ctx.request.headers.signature
    );
  }
}

module.exports = new TipsController();
