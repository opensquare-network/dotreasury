const dotenv = require("dotenv");
dotenv.config();

const { pinRates } = require("./pin/pinRate");

async function main() {
  try {
    await pinRates();
    console.log(`Last pin at:`, new Date());
  } catch (e) {
    console.error(e);
  }
}

module.exports = main;
