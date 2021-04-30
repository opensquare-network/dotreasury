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
} = require("../../mongo");

class IncomeController {
  async getTreasurySlash(ctx) {
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getTreasurySlashCollection(chain);
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
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getDemocracySlashCollection(chain);
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
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getElectionSlashCollection(chain);
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
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getStakingSlashCollection(chain);
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
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getIdentitySlashCollection(chain);
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
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getIncomeTransferCollection(chain);
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
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getIncomeInflationCollection(chain);
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
    const { chain } = ctx.params;
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0 || page < 0) {
      ctx.status = 400;
      return;
    }

    const col = await getOthersIncomeCollection(chain);
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
    const { chain } = ctx.params;

    let col;

    col = await getTreasurySlashCollection(chain);
    const treasurySlash = await col.estimatedDocumentCount();

    col = await getDemocracySlashCollection(chain);
    const democracySlash = await col.estimatedDocumentCount();

    col = await getIdentitySlashCollection(chain);
    const identitySlash = await col.estimatedDocumentCount();

    col = await getElectionSlashCollection(chain);
    const electionPhragmenSlash = await col.estimatedDocumentCount();

    col = await getStakingSlashCollection(chain);
    const stakingSlash = await col.estimatedDocumentCount();

    col = await getIncomeInflationCollection(chain);
    const inflation = await col.estimatedDocumentCount();

    col = await getOthersIncomeCollection(chain);
    const others = await col.estimatedDocumentCount();

    col = await getIncomeTransferCollection(chain);
    const transfer = await col.estimatedDocumentCount();

    ctx.body = {
      treasurySlash,
      democracySlash,
      identitySlash,
      electionPhragmenSlash,
      stakingSlash,
      inflation,
      transfer,
      others,
    };
  }
}

module.exports = new IncomeController();
