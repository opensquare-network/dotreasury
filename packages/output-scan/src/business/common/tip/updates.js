const { findRegistry } = require("../../../chain/specs");
const { getActiveTipByHash } = require("../../../mongo/service/tip");
const { getTippersCount, getTipFindersFee, getTipMetaFromStorage, } = require("./utils");

async function getTipCommonUpdates(hash, { blockHeight, blockHash }) {
  const tipInDb = await getActiveTipByHash(hash);
  if (!tipInDb) {
    throw new Error(`can not find tip in db. hash: ${ hash }`);
  }

  const newMeta = await getTipMetaFromStorage(hash, {
    blockHeight,
    blockHash,
  });
  const meta = {
    ...tipInDb.meta,
    tips: newMeta.tips,
    closes: newMeta.closes,
  };
  const registry = await findRegistry(blockHeight);
  const tippersCount = getTippersCount(registry, blockHash);
  const tipFindersFee = getTipFindersFee(registry);

  return { meta, tippersCount, tipFindersFee };
}

module.exports = {
  getTipCommonUpdates,
};
