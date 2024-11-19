const { gateTokenIdMap, revertGateTokenIdMap } = require("../../../consts");
const { fetchTickers } = require("../comm/tickers");
const { gate: Gate } = require("ccxt");
const { batchUpdateTokenPrices } = require("../../../mongo");

const gate = new Gate();

const source = "gate";

async function updateTokenPricesByGate() {
  const symbols = Object.values(gateTokenIdMap);
  const tickers = await fetchTickers(gate, symbols);
  const tokenPriceArr = tickers.map(ticker => {
    const { symbol, price, priceUpdateAt } = ticker;
    const token = revertGateTokenIdMap[symbol];
    return { token, price, priceUpdateAt, source };
  });

  await batchUpdateTokenPrices(tokenPriceArr);
}

module.exports = {
  updateTokenPricesByGate,
}
