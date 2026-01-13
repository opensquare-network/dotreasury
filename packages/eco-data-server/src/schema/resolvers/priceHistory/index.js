const dayjs = require("dayjs");
const { getPriceHistoryCol } = require("../../../mongo");
const { kusamaPriceData, polkadotPriceData } = require("./extraJsonData");

async function getPriceFrom(priceCol, time) {
  const [price] = await priceCol
    .find({
      openTime: { $lte: time },
    })
    .sort({ openTime: -1 })
    .limit(1)
    .toArray();

  if (price) {
    const value = price.quoteAssetVolume / price.volume;
    return value || price.open;
  }

  return null;
}

async function priceHistory(_, _args) {
  const { symbol, timestamp } = _args;
  const time = Number(timestamp);

  const col = await getPriceHistoryCol(symbol);
  const price = await getPriceFrom(col, time);

  if (price) {
    return { symbol, timestamp: time, price };
  }

  const date = dayjs(time).format("YYYY-MM-DD");

  if (symbol === "KSM") {
    return {
      symbol,
      timestamp: time,
      price: kusamaPriceData.get(date) || null,
    };
  }

  if (symbol === "DOT") {
    return {
      symbol,
      timestamp: time,
      price: polkadotPriceData.get(date) || null,
    };
  }

  return { symbol, timestamp: time, price: null };
}

module.exports = {
  priceHistory,
};
