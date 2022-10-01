const rateService = require("../../services/rate.service");
const { extractPage } = require("../../utils");

async function getUserRates(ctx) {
  const { chain, address } = ctx.params;

  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  ctx.body = await rateService.getRates(
    {
      chain,
      type: "user",
      index: address,
    },
    page,
    pageSize
  );
}

async function getUserRateStats(ctx) {
  const { chain, address } = ctx.params;

  ctx.body = await rateService.getRateStats({
    chain,
    type: "user",
    index: address,
  });
}

module.exports = {
  getUserRates,
  getUserRateStats,
}
