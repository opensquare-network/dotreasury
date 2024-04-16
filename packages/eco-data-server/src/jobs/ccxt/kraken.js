const { kraken: Kraken } = require("ccxt");
const { CHAINS } = require("../../apis/endpoints");
const { fetchTicker } = require("./common");
const { upsertChainPrice } = require("../../mongo/service");
const { CronJob } = require("cron");

const kraken = new Kraken();

const krakenCoinIdMap = {
  [CHAINS.interlay]: "INTR/USD",
  [CHAINS.kintsugi]: "KINT/USD",
  [CHAINS.hydradx]: "HDX/USD",
  [CHAINS.basilisk]: "BSX/USD",
  [CHAINS.phala]: "PHA/USD",
};

async function updateTokenPriceByKraken(chain) {
  const coinId = krakenCoinIdMap[chain];
  if (!coinId) {
    return
  }

  const ticker = await fetchTicker(kraken, coinId);
  if (!ticker) {
    return
  }
  const { price, priceUpdateAt } = ticker;
  await upsertChainPrice(chain, price, priceUpdateAt);
  console.log(`${ chain } price by kraken updated`);
}

async function updateTokenPricesByKraken() {
  const chains = Object.keys(krakenCoinIdMap);
  let promises = [];
  for (const chain of chains) {
    promises.push(updateTokenPriceByKraken(chain));
  }

  await Promise.all(promises);
}

function startKrakenTickerCronJob() {
  new CronJob("0 */1 * * * *", updateTokenPricesByKraken, null, true, "Asia/Shanghai");
}

module.exports = {
  startKrakenTickerCronJob,
}
