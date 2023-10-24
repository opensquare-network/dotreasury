const { extractPage } = require("../../../utils");
const { getCfgBlockRewardCol } = require("../../../mongo");

async function getBlockRewards(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const col = await getCfgBlockRewardCol();
  const items = await col
    .find({}, { projection: { _id: 0 } })
    .sort({
      "indexer.blockHeight": -1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.estimatedDocumentCount();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getBlockRewards,
}
