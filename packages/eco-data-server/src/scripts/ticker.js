require("dotenv").config();
// const { updateTokenPricesByGate } = require("../jobs/ccxt/gate");
const { fetchKrakenTicker } = require("../jobs/ccxt/kraken");

;(async () => {
  // await updateTokenPricesByGate();
  const ticker = await fetchKrakenTicker("KINT_USDT");
  console.log("ticker", ticker);
  // const ticker = await fetchTicker("KINT_USDT");
  // console.log(ticker);
  process.exit(0);
})();
