require("dotenv").config();
const {
  // updateTokenPricesByKraken,
  updateTokenPricesByGate,
} = require("./jobs/ccxt/tokens");

(async () => {
  await updateTokenPricesByGate();
  process.exit(0);
})();
