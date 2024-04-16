require("dotenv").config();
const { updateTokenPricesByGate } = require("../jobs/ccxt/gate");

;(async () => {
  await updateTokenPricesByGate();
  // const ticker = await fetchTicker("KINT_USDT");
  // console.log(ticker);
  process.exit(0);
})();
