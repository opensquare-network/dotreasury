const { binance: Binance } = require("ccxt");
const { upsertChainPrice } = require("../../mongo/service");
const { CHAINS } = require("../../apis/endpoints");
const { CronJob } = require("cron");
const { fetchTickers } = require("./comm/tickers");

const binance = new Binance();

const binanceCoinIdMap = {
  [CHAINS.polkadot]: "DOT/USDT",
  [CHAINS.kusama]: "KSM/USDT",
  [CHAINS.acala]: "ACA/USDT",
  [CHAINS.moonriver]: "MOVR/USDT",
};

const revertMap = Object.entries(binanceCoinIdMap).reduce((result, [key, value]) => {
  return { ...result, [value]: key };
}, {});

async function updateTokenPricesByBinance() {
  const symbols = Object.values(binanceCoinIdMap);
  const tickers = await fetchTickers(binance, symbols);
  const chains = [];
  for (const ticker of tickers) {
    const { symbol, price, priceUpdateAt } = ticker;
    const chain = revertMap[symbol];
    await upsertChainPrice(chain, price, priceUpdateAt);
    chains.push(chain);
  }
  console.log(`${ chains.join(",") } price by binance updated`);
}

function startBinanceTickerCronJob() {
  new CronJob("0 */1 * * * *", updateTokenPricesByBinance, null, true, "Asia/Shanghai");
}

module.exports = {
  startBinanceTickerCronJob,
}
