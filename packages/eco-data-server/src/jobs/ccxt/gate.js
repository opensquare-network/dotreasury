const { gate: Gate } = require("ccxt");
const { CHAINS } = require("../../apis/endpoints");
const { upsertChainPrice } = require("../../mongo/service");
const chunk = require("lodash.chunk");
const { CronJob } = require("cron");
const { fetchTicker } = require("./common");

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
  [CHAINS.bifrost]: "BNC_USDT",
  [CHAINS.integritee]: "TEER_USDT",
};

async function updateTokenPriceByGate(chain) {
  const coinId = gateCoinIdMap[chain];
  if (!coinId) {
    return
  }

  const ticker = await fetchTicker(gate, coinId);
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
  updateTokenPricesByGate,
  updateTokenPriceByGate,
  startGateTickerCronJob,
}
