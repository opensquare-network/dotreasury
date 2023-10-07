const {
  getPeriodCollection,
  getIncomePeriodCol,
} = require("../../mongo");

async function getOutputPeriods(ctx) {
  const periodCol = await getPeriodCollection();
  ctx.body = await periodCol
    .find({})
    .sort({ endHeight: 1 })
    .project({ transfers: 0 })
    .toArray();
}

async function getIncomePeriods(ctx) {
  const periodCol = await getIncomePeriodCol();
  ctx.body = await periodCol
    .find({})
    .sort({ endHeight: 1 })
    .project({ _id: 0 })
    .toArray();
}

module.exports = {
  getOutputPeriods,
  getIncomePeriods,
};
