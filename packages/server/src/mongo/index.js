if (process.env.CHAIN === "polkadot") {
  module.exports = require("./polkadot");
} else {
  module.exports = require("./kusama");
}
