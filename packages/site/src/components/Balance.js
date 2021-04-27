import React from "react";
import styled, { css } from "styled-components";

import PairText from "./PairText";
import { toPrecision, getPrecision } from "../utils";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../store/reducers/chainSlice";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  ${(p) =>
    p.reverse &&
    css`
      flex-direction: column-reverse;
      > :first-child * {
        font-size: 12px;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.3);
      }
      > :last-child {
        font-size: 14px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.65);
      }
    `}
`;

const UsdtWrapper = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.3);
`;

const Balance = ({
  value = 0,
  currency,
  usdt,
  reverse = false,
  isUnitPrice = true,
}) => {
  const symbol = useSelector(chainSymbolSelector);
  let usdtNumber = Number(usdt);
  if (value === null || value === undefined) value = 0;
  const precision = toPrecision(value, getPrecision(currency || symbol), false);
  if (isUnitPrice) usdtNumber = usdtNumber * precision;
  return (
    <Wrapper reverse={reverse}>
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
