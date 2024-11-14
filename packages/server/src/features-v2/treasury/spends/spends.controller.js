const { extractPage } = require("../../../utils");
const {
  getRangeCondition,
} = require("../../../features/common/getRangeCondition");
const {
  getSubsquareTreasurySpendCollection,
} = require("../../../mongo/polkadot");

function getCondition(ctx) {
  const { status, track } = ctx.request.query;

  const condition = {};
  if (status) {
    condition["state.state"] = status;
  }

  if (track) {
    condition["track.name"] = track;
  }

  const rangeCond = getRangeCondition(ctx);

  return { ...condition, ...rangeCond };
}

async function getSpends(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const condition = getCondition(ctx);
  const col = await getSubsquareTreasurySpendCollection();
  const total = await col.countDocuments(condition);
  const items = await col
    .aggregate([
      { $match: condition },
      { $skip: page * pageSize },
      { $limit: pageSize },
    ])
    .toArray();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getSpends,
};
