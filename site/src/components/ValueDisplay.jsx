import { abbreviateBigNumber, toPrecision } from "@osn/common";

function getEffectiveNumbers(value) {
  const effectiveNumbers = value
    .toString()
    .replace(/[^1-9]*$/, "")
    .replace(/[^0-9]/g, "");
  return effectiveNumbers;
}

function checkApproximateEqual(value, rawValue) {
  return getEffectiveNumbers(value) !== getEffectiveNumbers(rawValue);
}

export default function ValueDisplay({ value, precision, fixed = 2 }) {
  const balance = toPrecision(value, precision);

  if (Number(balance) > 1000000) {
    const abbreviateNum = abbreviateBigNumber(balance, fixed);
    const isApproximateEqual = checkApproximateEqual(balance, abbreviateNum);
    return (
      <>
        <span>{isApproximateEqual ? "≈ " : ""}</span>
        <span>{abbreviateNum}</span>
      </>
    );
  }

  const mul = Math.pow(10, fixed);
  const fixedNum = parseInt(Number(balance) * mul) / mul;
  const isApproximateEqual = checkApproximateEqual(balance, fixedNum);
  return (
    <>
      <span>{isApproximateEqual ? "≈ " : ""}</span>
      <span>{fixedNum.toLocaleString()}</span>
    </>
  );
}
