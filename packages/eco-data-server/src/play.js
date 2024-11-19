require("dotenv").config();
const { updateTokenPricesByKraken } = require("./jobs/ccxt/tokens");

(async () => {
  await updateTokenPricesByKraken();
})();
