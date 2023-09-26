const { getPeriodCollection } = require("../../mongo");

async function getPeriods(ctx) {
  const periodCol = await getPeriodCollection();
  ctx.body = await periodCol
    .find({})
    .sort({ endHeight: 1 })
    .project({ transfers: 0 })
    .toArray();
}

module.exports = {
  getPeriods,
};
