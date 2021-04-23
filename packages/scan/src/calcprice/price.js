const dayjs = require("dayjs");
// Kusama price data downloaded from:
// https://web-api.coinmarketcap.com/v1.1/cryptocurrency/quotes/historical?convert=USD,USDT&format=chart_crypto_details&id=5034&interval=1d&time_end=1619222400&time_start=1576108800
// Ref: https://coinmarketcap.com/currencies/kusama/
// Ref: https://www.coingecko.com/en/coins/kusama/historical_data/usd?end_date=2019-12-09&start_date=2019-12-06#panel
const kusamaJsonPriceData = require("./kusamaPrice.json");
// Polkadot price data downloaded from: https://cryptopro.app/graph.php?m=86648
// Ref: https://cryptopro.app/price/polkadot/
const polkadotJsonPriceData = require("./polkadotPrice.json");
const { getDotUsdtCollection, getKsmUsdtCollection } = require("./mongo");

const kusamaPriceData = new Map(
  Object.entries(kusamaJsonPriceData).map((item) => {
    const [
      date,
      {
        USDT: [USDT],
      },
    ] = item;
    return [date.split("T")[0], USDT];
  })
);

const polkadotPriceData = new Map(
  polkadotJsonPriceData.map((item) => {
    const [tempstemp, USD] = item;
    return [dayjs(tempstemp * 1000).format("YYYY-MM-DD"), USD];
  })
);

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
  const [price] = await priceCol
    .find({
      openTime: { $lte: time },
      volume: { $ne: "0.00000000" },
    })
    .sort({ openTime: -1 })
    .limit(1)
    .toArray();

  if (price) {
    return price.quoteAssetVolume / price.volume;
  }

  const date = dayjs(time).format("YYYY-MM-DD");
  if (process.env.CHAIN === "kusama") {
    return kusamaPriceData.get(date);
  } else if (process.env.CHAIN === "polkadot") {
    return polkadotPriceData.get(date);
  } else {
    return null;
  }
}

module.exports = {
  getPrice,
};
