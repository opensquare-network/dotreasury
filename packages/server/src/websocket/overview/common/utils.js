const { fromUint } = require("../../../utils");

function addUsdtValue(currUsdtValue, nextSymbolValue, symbolPrice, chain) {
  const nextUsdtValue = fromUint(nextSymbolValue, chain).multipliedBy(symbolPrice);
  return currUsdtValue ? nextUsdtValue.plus(currUsdtValue) : nextUsdtValue;
}

module.exports = {
  addUsdtValue,
};
