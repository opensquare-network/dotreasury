import BigNumber from "bignumber.js";

export function calculateBountyBond (description, depositBase, depositPerByte) {
  return new BigNumber(depositPerByte)
    .times(countUtf8Bytes(description))
    .plus(depositBase)
    .toString();
}

export function countUtf8Bytes(str) {
  return new Blob([str]).size;
}
