const { kraken: Kraken } = require("ccxt");
const { krakenTokenIdMap, revertKrakenTokenIdMap } = require("../../../consts");
const { fetchTickers } = require("../comm/tickers");
const { batchUpdateTokenPrices } = require("../../../mongo");

const kraken = new Kraken();

const source = "kraken";

async function updateTokenPricesByKraken() {
  const symbols = Object.values(krakenTokenIdMap);
  const tickers = await fetchTickers(kraken, symbols);
  const tokenPriceArr = tickers.map(ticker => {
    const { symbol, price, priceUpdateAt } = ticker;
    const token = revertKrakenTokenIdMap[symbol];
    return { token, price, priceUpdateAt, source };
  });

  console.log("tokenPriceArr", tokenPriceArr);
  await batchUpdateTokenPrices(tokenPriceArr);
}

module.exports = {
  updateTokenPricesByKraken,
};
