require("dotenv").config();
const { fetchTicker } = require("../jobs/ccxt/gate");

;(async () => {
  const ticker = await fetchTicker("KINT_USDT");
  console.log(ticker);
  process.exit(0);
})();
