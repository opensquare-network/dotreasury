import React from "react";
import styled from "styled-components";

import PairText from "./PairText";
import { toPrecision, getPrecision } from "../utils";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../store/reducers/chainSlice";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`;

const UsdtWrapper = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.3);
`;

const Balance = ({ value = 0, currency, usdt }) => {
  const symbol = useSelector(chainSymbolSelector);
  const usdtNumber = Number(usdt);
  if (value === null || value === undefined) value = 0;
  const precision = toPrecision(value, getPrecision(currency || symbol), false);
  return (
    <Wrapper>
      <PairText value={precision} unit={currency || symbol} />
      {usdt && !isNaN(usdtNumber) && (
        <UsdtWrapper>{`${
          Math.round(usdtNumber) === usdtNumber ? "" : "≈ "
        }$${usdtNumber.toFixed(2)}`}</UsdtWrapper>
      )}
    </Wrapper>
  );
};

export default Balance;
