const {
  getKsmUsdtCollection,
  getDotUsdtCollection,
  getCfgUsdtCol,
} = require("../../../mongo-price");

async function getLatestSymbolPrice() {
  const chain = process.env.CHAIN;

  let col;
  if (chain === "kusama") {
    col = await getKsmUsdtCollection();
  } else if (chain === "polkadot") {
    col = await getDotUsdtCollection();
  } else if (chain === "centrifuge") {
    col = await getCfgUsdtCol();
  }

  if (!col) {
    return 0;
  }

  const [latestItem] = await col
    .find()
    .sort({ openTime: -1 })
    .limit(1)
    .toArray();
  if (!latestItem) {
    return 0;
  }

  const price = latestItem.quoteAssetVolume / latestItem.volume;
  return price || latestItem.open;
}

module.exports = {
  getLatestSymbolPrice,
};
