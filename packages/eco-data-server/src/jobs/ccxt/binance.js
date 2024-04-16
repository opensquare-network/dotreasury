const { binance: Binance } = require("ccxt");
const { fetchTicker } = require("./common");
const { upsertChainPrice } = require("../../mongo/service");
const { CHAINS } = require("../../apis/endpoints");
const { CronJob } = require("cron");

const binance = new Binance();

const binanceCoinIdMap = {
  [CHAINS.polkadot]: "DOT/USDT",
  [CHAINS.kusama]: "KSM/USDT",
  [CHAINS.acala]: "ACA/USDT",
  [CHAINS.moonriver]: "MOVR/USDT",
};

async function updateTokenPriceByBinance(chain) {
  await binance.loadMarkets();
  const coinId = binanceCoinIdMap[chain];
  if (!coinId) {
    return
  }

  const ticker = await fetchTicker(binance, coinId);
  if (!ticker) {
    return
  }
  const { price, priceUpdateAt } = ticker;
  await upsertChainPrice(chain, price, priceUpdateAt);
  console.log(`${ chain } price by binance updated`);
}

async function updateTokenPricesByBinance() {
  const chains = Object.keys(binanceCoinIdMap);
  let promises = [];
  for (const chain of chains) {
    promises.push(updateTokenPriceByBinance(chain));
  }

  await Promise.all(promises);
}

function startBinanceTickerCronJob() {
  new CronJob("0 */1 * * * *", updateTokenPricesByBinance, null, true, "Asia/Shanghai");
}

module.exports = {
  updateTokenPriceByBinance,
  startBinanceTickerCronJob,
}
