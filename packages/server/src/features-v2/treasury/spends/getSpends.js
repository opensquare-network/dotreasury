const { extractPage } = require("../../../utils");
const {
  getRangeCondition,
} = require("../../../features/common/getRangeCondition");
const {
  getSubsquareTreasurySpendCollection,
} = require("../../../mongo/polkadot");

function getStatusFilter(ctx) {
  const { status } = ctx.request.query;
  if (!status) {
    return {};
  }

  return { "state.state": status };
}

function getAssetFilter(ctx) {
  const { asset } = ctx.request.query;
  if (!asset) {
    return {};
  }

  if (asset === "native") {
    return {
      $or: [
        { type: { $in: ["tip", "treasuryProposal"] } },
        {
          type: "treasurySpend",
          "assetType.type": "native",
        },
      ],
    };
  }

  return { type: "treasurySpend", "assetType.symbol": asset };
}

async function getSpends(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    ...getStatusFilter(ctx),
    ...getAssetFilter(ctx),
    ...getRangeCondition(ctx),
  };

  const col = await getSubsquareTreasurySpendCollection();
  const total = await col.countDocuments(q);
  const items = await col
    .find(q)
    .skip(page * pageSize)
    .limit(pageSize)
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
