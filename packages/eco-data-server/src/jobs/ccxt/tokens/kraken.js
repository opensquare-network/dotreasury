const { kraken: Kraken } = require("ccxt");
const { krakenTokenIdMap, revertKrakenTokenIdMap, CHAINS, ChainTokenMap } = require("../../../consts");
const { fetchTickers } = require("../comm/tickers");
const { batchUpdateTokenPrices } = require("../../../mongo");
const { upsertChainPrice } = require("../../../mongo/service");

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

  await batchUpdateTokenPrices(tokenPriceArr);

  for (const tokenPrice of tokenPriceArr) {
    const { token, price, priceUpdateAt } = tokenPrice;
    const chains = Object.values(CHAINS).filter(chain => ChainTokenMap[chain] === token);
    for (const chain of chains) {
      await upsertChainPrice(chain, price, priceUpdateAt);
    }
  }
}

module.exports = {
  updateTokenPricesByKraken,
};
