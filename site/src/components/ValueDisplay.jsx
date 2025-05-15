import { abbreviateBigNumber, toPrecision } from "../utils";

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

export default function ValueDisplay({
  value,
  precision = 0,
  fixed = 2,
  prefix = "",
  abbreviate = true,
}) {
  const balance = toPrecision(value, precision);

  if (Number(balance) > 100000 && abbreviate) {
    const abbreviateNum = abbreviateBigNumber(balance, fixed);
    const isApproximateEqual = checkApproximateEqual(balance, abbreviateNum);
    console.log(abbreviateNum);
    return (
      <>
        <span>{isApproximateEqual ? "≈ " : ""}</span>
        {prefix}
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
      {prefix}
      <span>{fixedNum.toLocaleString()}</span>
    </>
  );
}
