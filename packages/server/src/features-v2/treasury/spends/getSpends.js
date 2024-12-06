const isEmpty = require("lodash.isempty");
const { extractPage } = require("../../../utils");
const { HttpError } = require("../../../exc");
const {
  getSubsquareTreasurySpendCollection,
} = require("../../../mongo/polkadot");

function getRangeCondition(ctx) {
  const { range_type, min, max } = ctx.request.query;

  if (!range_type) {
    return {};
  }

  if (range_type !== "fiat") {
    throw new HttpError(400, `Invalid range_type: ${range_type}`);
  }

  const fiatValue = {};
  if (min) {
    fiatValue.$gte = Number(min);
  }
  if (max) {
    fiatValue.$lte = Number(max);
  }

  if (isEmpty(fiatValue)) {
    return {};
  }

  return { fiatValue };
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

function getSort(ctx) {
  const { sort } = ctx.query;
  if (!sort) {
    return;
  }

  let [sortField, sortDirection] = sort.split("_");

  let fieldName;
  if (sortField === "fiat") {
    fieldName = "fiatValue";
  } else {
    throw new HttpError(400, "Invalid sort field");
  }

  return {
    [fieldName]: sortDirection === "desc" ? -1 : 1,
    "indexer.blockHeight": -1,
  };
}

async function getSpends(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    ...getAssetFilter(ctx),
    ...getRangeCondition(ctx),
  };

  const sort = getSort(ctx);

  const col = await getSubsquareTreasurySpendCollection();
  const total = await col.countDocuments(q);
  const items = await col
    .find(q)
    .sort(sort)
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
