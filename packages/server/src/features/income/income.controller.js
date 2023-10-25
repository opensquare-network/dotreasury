const { extractPage } = require("../../utils");
const {
  getTreasurySlashCollection,
  getDemocracySlashCollection,
  getIdentitySlashCollection,
  getElectionSlashCollection,
  getStakingSlashCollection,
  getIncomeInflationCollection,
  getOthersIncomeCollection,
  getIncomeTransferCollection,
  getReferendaSlashCollection,
  getFellowshipReferendaSlashCollection,
  getCfgTxFeeCol,
  getCfgBlockRewardCol,
} = require("../../mongo");

class IncomeController {
  async getTreasurySlash(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getTreasurySlashCollection();
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

  async getDemocracySlash(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getDemocracySlashCollection();
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

  async getElectionPhragmenSlash(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getElectionSlashCollection();
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

  async getStakingSlash(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getStakingSlashCollection();
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

  async getIdentitySlash(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getIdentitySlashCollection();
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

  async getReferendaSlash(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getReferendaSlashCollection();
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

  async getFellowshipReferendaSlash(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getFellowshipReferendaSlashCollection();
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

  async getIncomeTransfer(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getIncomeTransferCollection();
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

  async getInflation(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getIncomeInflationCollection();
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

  async getOthers(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getOthersIncomeCollection();
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

  async getCount(ctx) {
    let col;

    col = await getTreasurySlashCollection();
    const treasurySlash = await col.estimatedDocumentCount();

    col = await getDemocracySlashCollection();
    const democracySlash = await col.estimatedDocumentCount();

    col = await getIdentitySlashCollection();
    const identitySlash = await col.estimatedDocumentCount();

    col = await getElectionSlashCollection();
    const electionPhragmenSlash = await col.estimatedDocumentCount();

    col = await getStakingSlashCollection();
    const stakingSlash = await col.estimatedDocumentCount();

    col = await getIncomeInflationCollection();
    const inflation = await col.estimatedDocumentCount();

    col = await getOthersIncomeCollection();
    const others = await col.estimatedDocumentCount();

    col = await getIncomeTransferCollection();
    const transfer = await col.estimatedDocumentCount();

    let centrifugeBlockRewards = 0;
    let centrifugeTxFees = 0;
    if ("centrifuge" === process.env.CHAIN) {
      col = await getCfgBlockRewardCol();
      centrifugeBlockRewards = await col.estimatedDocumentCount();

      col = await getCfgTxFeeCol();
      centrifugeTxFees = await col.estimatedDocumentCount();
    }

    ctx.body = {
      treasurySlash,
      democracySlash,
      identitySlash,
      electionPhragmenSlash,
      stakingSlash,
      inflation,
      transfer,
      centrifugeBlockRewards,
      centrifugeTxFees,
      others,
    };
  }
}

module.exports = new IncomeController();
