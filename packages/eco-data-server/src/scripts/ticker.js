require("dotenv").config();
const { updateTokenPriceByGate } = require("../jobs/ccxt/gate");
const { CHAINS } = require("../apis/endpoints");

;(async () => {
  await updateTokenPriceByGate(CHAINS.bifrost);
  // await updateTokenPricesByGate();
  // const ticker = await fetchKrakenTicker("KINT_USDT");
  // console.log("ticker", ticker);
  // const ticker = await fetchTicker("KINT_USDT");
  // console.log(ticker);
  process.exit(0);
})();
