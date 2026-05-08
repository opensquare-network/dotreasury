const { getCachedOverview } = require("./calcOverview");

async function getOverview(ctx) {
  const overview = await getCachedOverview();
  ctx.body = { ...overview };
}

module.exports = {
  getOverview,
};
