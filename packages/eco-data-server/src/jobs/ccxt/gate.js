const { gate: Gate } = require("ccxt");
const { CHAINS } = require("../../apis/endpoints");
const { upsertChainPrice } = require("../../mongo/service");
const chunk = require("lodash.chunk");
const { CronJob } = require("cron");

const gate = new Gate();

const gateCoinIdMap = {
  [CHAINS.polkadot]: "DOT_USDT",
  [CHAINS.centrifuge]: "CFG_USDT",
  [CHAINS.kusama]: "KSM_USDT",
  [CHAINS.moonbeam]: "GLMR_USDT",
  [CHAINS.moonriver]: "MOVR_USDT",
  [CHAINS.darwinia]: "RING_USDT",
  [CHAINS.acala]: "ACA_USDT",
  [CHAINS.karura]: "KAR_USDT",
  [CHAINS.interlay]: "INTR_USDT",
  [CHAINS.kintsugi]: "KINT_USDT",
};

async function fetchTicker(coinId) {
  let ticker;

  try {
    ticker = await gate.fetchTicker(coinId);
  } catch (e) {
    console.log(`Failed to fetch price of ${ coinId }`, e);
    return;
  }

  if (!ticker) {
    return;
  }

  return {
    price: ticker.last,
    priceUpdateAt: ticker.last_traded_at || new Date(),
  }
}

async function updateTokenPriceByGate(chain) {
  const coinId = gateCoinIdMap[chain];
  if (!coinId) {
    return
  }

  const ticker = await fetchTicker(coinId);
  if (!ticker) {
    return
  }
  const { price, priceUpdateAt } = ticker;
  await upsertChainPrice(chain, price, priceUpdateAt);
  console.log(`${ chain } price by gate updated`);
}

async function updateTokenPricesByGate() {
  const chains = Object.keys(gateCoinIdMap);
  const chunks = chunk(chains, chains.length / 2);
  const minutes = new Date().getMinutes();
  const selectedChains = minutes % 2 === 0 ? chunks[1] : chunks[0];
  let promises = [];
  for (const chain of selectedChains) {
    promises.push(updateTokenPriceByGate(chain));
  }

  await Promise.all(promises);
}

function startGateTickerCronJob() {
  new CronJob("0 */1 * * * *", updateTokenPricesByGate, null, true, "Asia/Shanghai");
}

module.exports = {
  gateCoinIdMap,
  fetchTicker,
  updateTokenPricesByGate,
  startGateTickerCronJob,
}
