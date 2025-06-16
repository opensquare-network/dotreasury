const {
  gateTokenIdMap,
  revertGateTokenIdMap,
  CHAINS,
  ChainTokenMap,
} = require("../../../consts");
const { fetchTickers } = require("../comm/tickers");
const { gate: Gate } = require("ccxt");
const { batchUpdateTokenPrices } = require("../../../mongo");
const { upsertChainPrice } = require("../../../mongo/service");

const gate = new Gate();

const source = "gate";

async function updateTokenPricesByGate() {
  const symbols = Object.values(gateTokenIdMap);
  const tickers = await fetchTickers(gate, symbols);
  const tokenPriceArr = tickers.map((ticker) => {
    const { symbol, price, priceUpdateAt } = ticker;
    const token = revertGateTokenIdMap[symbol];
    return { token, price, priceUpdateAt, source };
  });

  await batchUpdateTokenPrices(tokenPriceArr);

  for (const tokenPrice of tokenPriceArr) {
    const { token, price, priceUpdateAt } = tokenPrice;
    const chains = Object.values(CHAINS).filter(
      (chain) => ChainTokenMap[chain] === token,
    );
    for (const chain of chains) {
      await upsertChainPrice(chain, price, priceUpdateAt);
      console.log(`${chains} price by gate updated`);
    }
  }
}

module.exports = {
  updateTokenPricesByGate,
};
