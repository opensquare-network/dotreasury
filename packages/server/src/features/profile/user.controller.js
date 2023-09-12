const rateService = require("../../services/rate.service");
const { extractPage } = require("../../utils");

async function getUserRates(ctx) {
  const { address } = ctx.params;

  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  ctx.body = await rateService.getRates(
    {
      chain: process.env.CHAIN,
      type: "user",
      index: address,
    },
    page,
    pageSize,
  );
}

async function getUserRateStats(ctx) {
  const { address } = ctx.params;

  ctx.body = await rateService.getRateStats({
    chain: process.env.CHAIN,
    type: "user",
    index: address,
  });
}

module.exports = {
  getUserRates,
  getUserRateStats,
};
