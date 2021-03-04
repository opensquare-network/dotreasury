const { getTipCollection } = require("../../mongo");
const linkService = require("../../services/link.services");
const { extractPage } = require("../../utils");
const { normalizeTip } = require("./utils");

function getCondition(ctx) {
  const { status } = ctx.request.query;
  let condition = {};
  switch(status){
    case 'tipping':
      condition = {
        $or: [{"state.state":"NewTip"}, {"state.state":"tip"}]
      };
      break;
    case 'retracted':
      // condition['state.state'] = 'TipRetracted';
      condition = {
        "state.state": "TipRetracted"
      }
      break;
    case 'closed':
      condition = {
        "state.state": "TipClosed"
      }
      break;
  }
  return condition;
}

class TipsController {
  async getTips(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }
    const condition = getCondition(ctx);

    const tipCol = await getTipCollection();
    const total = tipCol.find(condition, { timeline: 0 }).count();
    const list = tipCol
      .find(condition, { timeline: 0 })
      .sort({
        isClosedOrRetracted: 1,
        "indexer.blockHeight": -1,
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
    const result = await Promise.all([total, list]);
    // const total = await tipCol.estimatedDocumentCount();

    ctx.body = {
      items: result[1].map(normalizeTip),
      page,
      pageSize,
      total: result[0],
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
