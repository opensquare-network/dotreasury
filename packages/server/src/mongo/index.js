if (process.env.CHAIN === "polkadot") {
  module.exports = require("./polkadot");
} else if (process.env.CHAIN === "kusama") {
  module.exports = require("./kusama");
} else {
  throw new Error(`Unsupported chain set by env.CHAIN: ${ process.env.CHAIN }`);
}
