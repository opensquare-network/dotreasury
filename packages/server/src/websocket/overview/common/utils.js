const BigNumber = require("bignumber.js");

function addUsdtValue(currUsdtValue, nextSymbolValue, symbolPrice, chain) {
  const nextUsdtValue = new BigNumber(nextSymbolValue)
    .div(Math.pow(10, chain === "kusama" ? 12 : 10))
    .multipliedBy(symbolPrice);
  return currUsdtValue ? nextUsdtValue.plus(currUsdtValue) : nextUsdtValue;
}

module.exports = {
  addUsdtValue,
};
