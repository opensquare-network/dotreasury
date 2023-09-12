const { getOverviewV2 } = require("../../websocket/store");

async function getOverview(ctx) {
  ctx.body = {
    ...getOverviewV2(),
  };
}

module.exports = {
  getOverview,
};
