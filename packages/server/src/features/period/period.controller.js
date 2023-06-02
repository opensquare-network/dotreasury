const { getPeriodCollection } = require("../../mongo");

async function getPeriods(ctx) {
  const { chain } = ctx.params;
  const periodCol = await getPeriodCollection(chain);
  ctx.body = await periodCol
    .find({})
    .sort({ endHeight: 1 })
    .project({ transfers: 0 })
    .toArray();
}

module.exports = {
  getPeriods,
};
