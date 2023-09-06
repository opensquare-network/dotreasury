const { getActiveTipByHash } = require("./tip");
const { logger } = require("@osn/scan-common")
const { getTipperCollection } = require("../index")

async function insertTipper(tipHash, tipper, value, indexer) {
  const tip = await getActiveTipByHash(tipHash);
  if (!tip) {
    logger.error(`Can not find motion when insert motion voter, height: ${ indexer.blockHeight }`);
    return
  }

  const tipHeight = tip.indexer.blockHeight;
  const col = await getTipperCollection();
  await col.updateOne(
    {
      tipHeight,
      tipHash,
      tipper,
    },
    {
      $set: { indexer, value },
    },
    { upsert: true },
  )
}

module.exports = {
  insertTipper,
}
