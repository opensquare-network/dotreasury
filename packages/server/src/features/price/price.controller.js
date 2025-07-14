const {
  getKsmUsdtCollection,
  getDotUsdtCollection,
  getCfgUsdtCol,
  getMythUsdtCol,
} = require("../../mongo-price/index");
const dayjs = require("dayjs");
const {
  polkadotPriceData,
  kusamaPriceData,
} = require("../../../../price/src/calcprice/price");

function getPriceCol(symbol) {
  if (symbol === "DOT") return getDotUsdtCollection();
  if (symbol === "KSM") return getKsmUsdtCollection();
  if (symbol === "CFG") return getCfgUsdtCol();
  if (symbol === "MYTH") return getMythUsdtCol();

  throw new Error("Unsupported symbol: " + symbol);
}

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

async function getPrice(ctx) {
  const { symbol, timestamp } = ctx.query;
  if (!symbol || !timestamp) {
    ctx.status = 400;
    ctx.body = { error: "symbol and timestamp are required" };
    return;
  }

  const col = await getPriceCol(symbol);
  const price = await getPriceFrom(col, Number(timestamp));

  if (price) {
    ctx.body = { price };
    return;
  }

  const date = dayjs(Number(timestamp)).format("YYYY-MM-DD");

  if (symbol === "KSM") {
    ctx.body = { price: kusamaPriceData.get(date) || null };
    return;
  }

  if (symbol === "DOT") {
    ctx.body = { price: polkadotPriceData.get(date) || null };
    return;
  }

  ctx.body = { price: null };
}

module.exports = { getPrice };
