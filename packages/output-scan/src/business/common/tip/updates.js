const { computeTipValue } = require("./median");
const { getTipFindersFeeFromApi } = require("./utils");
const { getTippersCountFromApi } = require("./utils");
const { getActiveTipByHash } = require("../../../mongo/service/tip");
const { getTipMetaFromStorage, } = require("./utils");

async function getTipCommonUpdates(hash, { blockHeight, blockHash }) {
  const tipInDb = await getActiveTipByHash(hash);
  if (!tipInDb) {
    throw new Error(`can not find tip in db. hash: ${ hash }`);
  }

  const newMeta = await getTipMetaFromStorage(blockHash, hash);
  const meta = {
    ...tipInDb.meta,
    tips: newMeta.tips,
    closes: newMeta.closes,
  };
  const medianValue = computeTipValue(newMeta)
  const tippersCount = await getTippersCountFromApi(blockHash);
  const tipFindersFee = await getTipFindersFeeFromApi(blockHash);

  return { medianValue, meta, tippersCount, tipFindersFee };
}

module.exports = {
  getTipCommonUpdates,
};
