const { fromUint } = require("../../../utils");

function addUsdtValue(currUsdtValue, nextSymbolValue, symbolPrice) {
  const nextUsdtValue = fromUint(nextSymbolValue).multipliedBy(symbolPrice);
  return currUsdtValue ? nextUsdtValue.plus(currUsdtValue) : nextUsdtValue;
}

module.exports = {
  addUsdtValue,
};
