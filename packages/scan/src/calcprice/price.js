const { getDotUsdtCollection, getKsmUsdtCollection } = require("./mongo");

function getPriceCollection(chain) {
  if (chain === "polkadot") {
    return getDotUsdtCollection();
  } else if (chain === "kusama") {
    return getKsmUsdtCollection();
  } else {
    throw new Error("Unsupport chain " + chain);
  }
}

async function getPrice(time) {
  const priceCol = await getPriceCollection(process.env.CHAIN);
  const price = await priceCol
    .find({
      openTime: { $lte: time },
      volume: { $ne: "0.00000000" },
    })
    .sort({ openTime: -1 })
    .limit(1)
    .toArray();
  return price[0];
}

async function getAvgPrice(time) {
  const price = await getPrice(time);
  return price.quoteAssetVolume / price.volume;
}

module.exports = {
  getPrice,
  getAvgPrice,
};
