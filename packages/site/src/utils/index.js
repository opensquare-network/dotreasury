import BigNumber from "bignumber.js";
import { stringUpperFirst } from "@polkadot/util";

export function toPrecision(value, precision = 0, paddingZero = true) {
  precision = Number(precision);
  const big = new BigNumber(value).dividedBy(Math.pow(10, precision));

  if (paddingZero) {
    return big.toFixed(precision);
  } else {
    return big.toNumber();
  }
}

export function stringCamlToWords(str) {
  return stringUpperFirst(str).replace(/(.)([A-Z])/g, "$1 $2");
}
