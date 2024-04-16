const { binance: Binance, Gate } = require("ccxt");
const { fetchTicker } = require("./common");
const { upsertChainPrice } = require("../../mongo/service");
const { CHAINS } = require("../../apis/endpoints");

const binance = new Binance();

const binanceCoinIdMap = {
};

async function updateTokenPriceByBinance(chain) {
  await binance.loadMarkets();
  console.log(binance.symbols);
  return;
  const coinId = binanceCoinIdMap[chain];
  if (!coinId) {
    return
  }

  const ticker = await fetchTicker(binance, coinId);
  if (!ticker) {
    return
  }
  const { price, priceUpdateAt } = ticker;
  // await upsertChainPrice(chain, price, priceUpdateAt);
  console.log(`${ chain } price by binance updated`);
}

module.exports = {
  updateTokenPriceByBinance,
}
