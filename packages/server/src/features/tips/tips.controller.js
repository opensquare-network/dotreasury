const { getTipCollection } = require("../../mongo");
const { getLinkCollection } = require("../../mongo-admin");
const { extractPage, isValidSignature } = require("../../utils");
const { normalizeTip } = require("./utils");

async function checkAdmin(address) {
  return true;
}

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

  async getTipLinks(ctx) {
    const { blockHeight, tipHash } = ctx.params;

    const linkCol = await getLinkCollection();
    const tipLinks = await linkCol.findOne({
      type: "tip",
      indexer: {
        blockHeight,
        tipHash,
      },
    });

    ctx.body = tipLinks?.links ?? [];
  }

  async verifySignature(ctx, message) {
    if (!ctx.request.headers.signature) {
      ctx.status = 400;
      return false;
    }

    const [address, signature] = ctx.request.headers.signature.split("/");
    if (!address || !signature) {
      ctx.status = 400;
      return false;
    }

    const isAdmin = await checkAdmin(address);
    if (!isAdmin) {
      ctx.status = 401;
      return false;
    }

    const isValid = isValidSignature(message, signature, address);

    if (!isValid) {
      ctx.status = 400;
      return false;
    }

    return true;
  }

  async createTipLink(ctx) {
    const { blockHeight, tipHash } = ctx.params;
    const { link, description } = ctx.request.body;

    const success = await this.verifySignature(ctx, JSON.stringify({
      type: "tips",
      index: `${blockHeight}_${tipHash}`,
      link,
      description,
    }));
    if (!success) {
      return;
    }

    const linkCol = await getLinkCollection();
    await linkCol.updateOne({
      type: "tip",
      indexer: {
        blockHeight,
        tipHash,
      },
    }, {
      $push: {
        links: {
          link,
          description,
          inReasons: false,
        }
      }
    }, { upsert: true });

    ctx.body = true;
  }

  async deleteTipLink(ctx) {
    const { blockHeight, tipHash, linkIndex } = ctx.params;

    const success = await this.verifySignature(ctx, JSON.stringify({
      type: "tips",
      index: `${blockHeight}_${tipHash}`,
      linkIndex,
    }));
    if (!success) {
      return;
    }

    const linkCol = await getLinkCollection();
    await linkCol.updateOne({
      type: "tip",
      indexer: {
        blockHeight,
        tipHash,
      },
    }, {
      $unset: {
        [`links.${linkIndex}`]: 1
      }
    });

    await linkCol.updateOne({
      type: "tip",
      indexer: {
        blockHeight,
        tipHash,
      },
    }, {
      $pull: {
        links: null
      }
    });

    ctx.body = true;
  }
}

module.exports = new TipsController();
