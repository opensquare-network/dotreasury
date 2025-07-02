import { getPrecision } from "../utils";
import { STATEMINT_ASSETS } from "../constants/statemint";
import { MYTH } from "../constants/foreignAssets";
import ValueDisplay from "./ValueDisplay";
import styled from "styled-components";
import { useMemo } from "react";

const Wrapper = styled.div`
  width: 112px;
  color: var(--textPrimary);
`;

export default function TreasurySpendValueDisplay({ isNative, value, symbol }) {
  const decimals = useMemo(() => {
    if (isNative) {
      return getPrecision(symbol);
    }
    const SYMBOL_DECIMALS = STATEMINT_ASSETS.concat(MYTH);
    return SYMBOL_DECIMALS.find(
      (item) => item?.symbol.toLocaleUpperCase() === symbol,
    ).decimals;
  }, [isNative, symbol]);

  return (
    <Wrapper>
      <ValueDisplay value={value} precision={decimals} /> {symbol}
    </Wrapper>
  );
}
