const { getTipCollection, getTipFinderCollection } = require("../../mongo");
const linkService = require("../../services/link.service");
const commentService = require("../../services/comment.service");
const { extractPage, ADMINS } = require("../../utils");
const { normalizeTip } = require("./utils");
const { HttpError } = require("../../exc");

function getCondition(ctx) {
  const { status, beneficiary, finder, proposer } = ctx.request.query;

  const condition = {};
  if (status) {
    condition["state.state"] = { $in: status.split("||") };
  }

  if (beneficiary) {
    condition["meta.who"] = beneficiary;
  }

  if (finder || proposer) {
    condition["finder"] = finder || proposer;
  }

  return condition;
}

async function getAdmins(chain, blockHeight, tipHash) {
  const col = await getTipCollection(chain);
  const tip = await col.findOne({
    "indexer.blockHeight": blockHeight,
    hash: tipHash,
  });
  const owner = tip?.finder;

  return [...ADMINS, owner];
}

class TipsController {
  async getTips(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }
    const condition = getCondition(ctx);

    const tipCol = await getTipCollection(chain);
    const total = tipCol.countDocuments(condition);
    const list = tipCol
      .find(condition)
      .sort({
        isFinal: 1,
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

  async getTippings(ctx) {
    const { chain } = ctx.params;
    const { tipper } = ctx.request.query;
    const tipCol = await getTipCollection(chain);
    const items = await tipCol
      .find({
        "state.state": { $in: ["NewTip", "tip"] },
        timeline: {
          $not: {
            $elemMatch: {
              $or: [
                { method: "tip", "args.tipper": tipper },
                { method: "tipNew", "args.finder": tipper }
              ]
            }
          }
        }
      })
      .sort({ "indexer.blockHeight": -1 })
      .toArray();

    ctx.body = items.map(normalizeTip);
  }

  async getTipFinders(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    const tipFinderCol = await getTipFinderCollection(chain);
    const total = await tipFinderCol.estimatedDocumentCount();
    const items = await tipFinderCol
      .find({})
      .sort({ count: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();

    ctx.body = {
      items,
      page,
      pageSize,
      total,
    };
  }

  async getTipDetail(ctx) {
    const { tipId, chain } = ctx.params;

    let blockHeight = null;
    let tipHash = null;

    const match = tipId.match(/^(\d+)_(0x[0-9a-f]+)$/);
    if (match) {
      blockHeight = parseInt(match[1]);
      tipHash = match[2];
    } else {
      tipHash = tipId;
    }

    const tipCol = await getTipCollection(chain);
    let tip = null;
    if (blockHeight === null) {
      tip = await tipCol.findOne(
        { hash: tipHash },
        {
          sort: { "indexer.blockHeight": -1 },
        }
      );
    } else {
      tip = await tipCol.findOne({
        hash: tipHash,
        "indexer.blockHeight": parseInt(blockHeight),
      });
    }

    if (!tip) {
      ctx.status = 404;
      return;
    }

    const tipValue =
      tip.state?.state === "TipClosed" ? tip.state?.data?.[2] : null;

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
      medianValue: tipValue ?? tip.medianValue,
      symbolPrice: tip.symbolPrice,
      tippersCount: tip.tippersCount,
      tipFindersFee: tip.tipFindersFee,
      closeFromBlockHeight: tip.meta?.closes,
      timeline: tip.timeline,
    };
  }

  async getTipLinks(ctx) {
    const { chain, tipHash } = ctx.params;
    const blockHeight = parseInt(ctx.params.blockHeight);

    ctx.body = await linkService.getLinks({
      indexer: {
        chain,
        type: "tip",
        index: {
          blockHeight,
          tipHash,
        },
      },
      getReason: async () => {
        const tipCol = await getTipCollection(chain);
        const tip = await tipCol.findOne({
          hash: tipHash,
          "indexer.blockHeight": blockHeight,
        });
        return tip?.reason;
      },
    });
  }

  async createTipLink(ctx) {
    const { chain, tipHash } = ctx.params;
    const blockHeight = parseInt(ctx.params.blockHeight);

    const { link, description } = ctx.request.body;

    const admins = await getAdmins(chain, blockHeight, tipHash);

    ctx.body = await linkService.createLink(
      {
        indexer: {
          chain,
          type: "tip",
          index: {
            blockHeight,
            tipHash,
          },
        },
        link,
        description,
      },
      ctx.request.headers.signature,
      admins,
    );
  }

  async deleteTipLink(ctx) {
    const { tipHash, chain } = ctx.params;
    const blockHeight = parseInt(ctx.params.blockHeight);
    const linkIndex = parseInt(ctx.params.linkIndex);

    const admins = await getAdmins(chain, blockHeight, tipHash);

    ctx.body = await linkService.deleteLink(
      {
        indexer: {
          chain,
          type: "tip",
          index: {
            blockHeight,
            tipHash,
          },
        },
        linkIndex,
      },
      ctx.request.headers.signature,
      admins,
    );
  }

  // Comments API
  async getTipComments(ctx) {
    const { chain, tipHash } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    const blockHeight = parseInt(ctx.params.blockHeight);

    ctx.body = await commentService.getComments(
      {
        chain,
        type: "tip",
        index: {
          blockHeight,
          tipHash,
        },
      },
      page,
      pageSize,
    );
  }

  async postTipComment(ctx) {
    const { chain, tipHash } = ctx.params;
    const blockHeight = parseInt(ctx.params.blockHeight);
    const { content } = ctx.request.body;
    const user = ctx.request.user;
    if (!content) {
      throw new HttpError(400, "Comment content is missing");
    }

    const tipCol = await getTipCollection(chain);
    const tip = await tipCol.findOne({
      hash: tipHash,
      "indexer.blockHeight": blockHeight,
    });
    if (!tip) {
      throw new HttpError(404, "Tip not found");
    }

    ctx.body = await commentService.postComment(
      {
        chain,
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
