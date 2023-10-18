const dayjs = require("dayjs");
// Kusama price data downloaded from:
// https://web-api.coinmarketcap.com/v1.1/cryptocurrency/quotes/historical?convert=USD,USDT&format=chart_crypto_details&id=5034&interval=1d&time_end=1619222400&time_start=1576108800
// Ref: https://coinmarketcap.com/currencies/kusama/
// Ref: https://www.coingecko.com/en/coins/kusama/historical_data/usd?end_date=2019-12-09&start_date=2019-12-06#panel
const kusamaJsonPriceData = require("./kusamaPrice.json");
// Polkadot price data downloaded from: https://cryptopro.app/graph.php?m=86648
// Ref: https://cryptopro.app/price/polkadot/
const polkadotJsonPriceData = require("./polkadotPrice.json");
const {
  getDotUsdtCollection,
  getKsmUsdtCollection,
  getCfgUsdtCol,
} = require("../mongo");

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
  } else if (chain === "centrifuge") {
    return getCfgUsdtCol();
  } else {
    throw new Error("Unsupport chain " + chain);
  }
}

async function getPrice(chain, time) {
  const priceCol = await getPriceCollection(chain);
  const [price] = await priceCol
    .find({
      openTime: { $lte: time },
    })
    .sort({ openTime: -1 })
    .limit(1)
    .toArray();

  if ("centrifuge" === chain) {
    return price.open;
  }

  if (price) {
    const value = price.quoteAssetVolume / price.volume;
    return value || price.open;
  }

  const date = dayjs(time).format("YYYY-MM-DD");
  if (chain === "kusama") {
    return kusamaPriceData.get(date);
  } else if (chain === "polkadot") {
    return polkadotPriceData.get(date);
  } else {
    return null;
  }
}

module.exports = {
  getPrice,
};
