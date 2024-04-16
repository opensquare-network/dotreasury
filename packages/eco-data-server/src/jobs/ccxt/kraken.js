const { kraken: Kraken } = require("ccxt");
const { CHAINS } = require("../../apis/endpoints");
const { upsertChainPrice } = require("../../mongo/service");
const { CronJob } = require("cron");
const { fetchTickers } = require("./comm/tickers");

const kraken = new Kraken();

const krakenCoinIdMap = {
  [CHAINS.interlay]: "INTR/USD",
  [CHAINS.kintsugi]: "KINT/USD",
  [CHAINS.hydradx]: "HDX/USD",
  [CHAINS.basilisk]: "BSX/USD",
  [CHAINS.phala]: "PHA/USD",
};

const revertMap = Object.entries(krakenCoinIdMap).reduce((result, [key, value]) => {
  return { ...result, [value]: key };
}, {});

async function updateTokenPricesByKraken() {
  const symbols = Object.values(krakenCoinIdMap);
  const tickers = await fetchTickers(kraken, symbols);
  const chains = [];
  for (const ticker of tickers) {
    const { symbol, price, priceUpdateAt } = ticker;
    const chain = revertMap[symbol];
    await upsertChainPrice(chain, price, priceUpdateAt);
    chains.push(chain);
  }
  console.log(`${ chains.join(",") } price by kraken updated`);
}

function startKrakenTickerCronJob() {
  new CronJob("0 */1 * * * *", updateTokenPricesByKraken, null, true, "Asia/Shanghai");
}

module.exports = {
  startKrakenTickerCronJob,
}
