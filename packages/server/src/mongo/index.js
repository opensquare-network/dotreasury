if (process.env.CHAIN === "polkadot") {
  module.exports = require("./polkadot");
} else if (process.env.CHAIN === "kusama") {
  module.exports = require("./kusama");
} else if (process.env.CHAIN === "centrifuge") {
  module.exports = require("./centrifuge");
} else {
  throw new Error(`Unsupported chain set by env.CHAIN: ${ process.env.CHAIN }`);
}
