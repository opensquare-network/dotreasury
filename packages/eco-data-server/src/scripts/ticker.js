require("dotenv").config();
// const { updateTokenPriceByGate } = require("../jobs/ccxt/gate");
// const { CHAINS } = require("../apis/endpoints");
const { updateTokenPriceByBinance } = require("../jobs/ccxt/binance");
const { gate: Gate } = require("ccxt");
const { fetchTickers } = require("../jobs/ccxt/comm/tickers");
const { fetchTicker } = require("../jobs/ccxt/common");
const { updateTokenPricesByGate } = require("../jobs/ccxt/gate");
const gate = new Gate();

;(async () => {
  await updateTokenPricesByGate();
  await gate.loadMarkets();
  console.log(gate.symbols);
  await fetchTickers(gate, ["CFG/USDT", "GLMR/USDT"]);
  // await fetchTicker(gate, "CFG/USDT");
  // await updateTokenPriceByBinance();
  // await updateTokenPriceByGate(CHAINS.bifrost);
  // await updateTokenPricesByGate();
  // const ticker = await fetchKrakenTicker("KINT_USDT");
  // console.log("ticker", ticker);
  // const ticker = await fetchTicker("KINT_USDT");
  // console.log(ticker);
  process.exit(0);
})();
