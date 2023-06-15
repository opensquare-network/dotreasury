const BigNumber = require("bignumber.js");

const decimals = {
  kusama: 12,
  polkadot: 10,
}

function normalizeTokenValue(value, chain) {
  const decimal = decimals[chain];
  if (undefined === decimal) {
    throw new Error(`Can not find decimal of chain ${ chain }`);
  }

  return new BigNumber(value).div(Math.pow(10, decimal)).toString();
}

module.exports = {
  normalizeTokenValue,
}
