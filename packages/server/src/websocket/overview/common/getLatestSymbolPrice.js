const { getKsmUsdtCollection, getDotUsdtCollection } = require("../../../mongo-price");

async function getLatestSymbolPrice(chain) {
  let col;
  if (chain === "kusama") {
    col = await getKsmUsdtCollection();
  } else if (chain === "polkadot") {
    col = await getDotUsdtCollection();
  }

  if (!col) {
    return 0;
  }

  const [latestItem] = await col
    .find({ volume: { $ne: "0.00000000" } })
    .sort({ openTime: -1 })
    .limit(1)
    .toArray();
  if (!latestItem) {
    return 0;
  }

  return latestItem.quoteAssetVolume / latestItem.volume;
}

module.exports = {
  getLatestSymbolPrice,
};
