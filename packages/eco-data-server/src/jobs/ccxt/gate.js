const { gate: Gate } = require("ccxt");
const { CHAINS } = require("../../apis/endpoints");
const { upsertChainPrice } = require("../../mongo/service");
const { CronJob } = require("cron");
const { fetchTickers } = require("./comm/tickers");

const gate = new Gate();

const gateCoinIdMap = {
  [CHAINS.centrifuge]: "CFG/USDT",
  [CHAINS.moonbeam]: "GLMR/USDT",
  [CHAINS.darwinia]: "RING/USDT",
  [CHAINS.karura]: "KAR/USDT",
  [CHAINS.bifrost]: "BNC/USDT",
  [CHAINS.integritee]: "TEER/USDT",
};

const revertMap = Object.entries(gateCoinIdMap).reduce((result, [key, value]) => {
  return { ...result, [value]: key };
}, {});

async function updateTokenPricesByGate() {
  const symbols = Object.values(gateCoinIdMap);
  const tickers = await fetchTickers(gate, symbols);
  const chains = [];
  for (const ticker of tickers) {
    const { symbol, price, priceUpdateAt } = ticker;
    const chain = revertMap[symbol];
    await upsertChainPrice(chain, price, priceUpdateAt);
    chains.push(chain);
  }
  console.log(`${ chains.join(",") } price by gate updated`);
}

function startGateTickerCronJob() {
  new CronJob("0 */1 * * * *", updateTokenPricesByGate, null, true, "Asia/Shanghai");
}

module.exports = {
  gateCoinIdMap,
  updateTokenPricesByGate,
  startGateTickerCronJob,
}
