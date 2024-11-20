import { getPrecision } from "../utils";
import { STATEMINT_ASSETS } from "../constants/statemint";
import { MYTH } from "../constants/foreignAssets";
import ValueDisplay from "./ValueDisplay";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 112px;
  color: var(--textPrimary);
`;

export default function TreasurySpendValueDisplay({ isNative, value, symbol }) {
  let { decimals } = getPrecision(symbol);
  const SYMBOL_DECIMALS = STATEMINT_ASSETS.concat(MYTH);

  if (!isNative) {
    decimals = SYMBOL_DECIMALS.find(
      (item) => item?.symbol.toLocaleUpperCase() === symbol,
    ).decimals;
  }

  return (
    <Wrapper>
      <ValueDisplay value={value} precision={decimals} /> {symbol}
    </Wrapper>
  );
}
