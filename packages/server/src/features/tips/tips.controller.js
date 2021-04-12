const { getTipCollection } = require("../../mongo");
const linkService = require("../../services/link.service");
const commentService = require("../../services/comment.service");
const { extractPage } = require("../../utils");
const { normalizeTip } = require("./utils");
const { HttpError } = require("../../exc");

function getCondition(ctx) {
  const { status } = ctx.request.query;

  const condition = {};
  if (status) {
    condition["state.state"] = { $in: status.split("||") };
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
    const total = tipCol.countDocuments(condition);
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

    ctx.body = {
      items: result[1].map(normalizeTip),
      page,
      pageSize,
      total: result[0],
    };
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
      indexer: {
        chain: "kusama",
        type: "tip",
        index: {
          blockHeight,
          tipHash,
        },
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
        indexer: {
          chain: "kusama",
          type: "tip",
          index: {
            blockHeight,
            tipHash,
          },
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
        indexer: {
          chain: "kusama",
          type: "tip",
          index: {
            blockHeight,
            tipHash,
          },
        },
        linkIndex,
      },
      ctx.request.headers.signature
    );
  }

  // Comments API
  async getTipComments(ctx) {
    const { page, pageSize } = extractPage(ctx);
    const tipHash = ctx.params.tipHash;
    const blockHeight = parseInt(ctx.params.blockHeight);

    ctx.body = await commentService.getComments(
      {
        chain: "kusama",
        type: "tip",
        index: {
          blockHeight,
          tipHash,
        },
      },
      page,
      pageSize,
      ctx.request.user
    );
  }

  async postTipComment(ctx) {
    const tipHash = ctx.params.tipHash;
    const blockHeight = parseInt(ctx.params.blockHeight);
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }

    const tipCol = await getTipCollection();
    const tip = await tipCol.findOne({
      hash: tipHash,
      "indexer.blockHeight": blockHeight,
    });
    if (!tip) {
      throw new HttpError(404, "Tip not found");
    }

    ctx.body = await commentService.postComment(
      {
        chain: "kusama",
        type: "tip",
        index: {
          blockHeight,
          tipHash,
        },
      },
      content,
      user
    );
  }
}

module.exports = new TipsController();
