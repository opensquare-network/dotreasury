import React from "react";
import styled, { css } from "styled-components";

import PairText from "./PairText";
import { toPrecision, getPrecision } from "../utils";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../store/reducers/chainSlice";
import { toLocaleStringWithFixed } from "../utils";

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
  ${(p) =>
    p.horizontal &&
    css`
      flex-direction: row;
      align-items: center;
      > :not(:first-child) {
        margin-left: 16px;
      }
    `}
`;

const UsdtWrapper = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  ${(p) =>
    p.horizontal &&
    css`
      align-self: center;
    `}
`;

const Balance = ({
  value = 0,
  currency,
  usdt,
  reverse = false,
  isUnitPrice = true,
  horizontal = false,
}) => {
  const symbol = useSelector(chainSymbolSelector);
  let usdtNumber = Number(usdt);
  if (value === null || value === undefined) value = 0;
  const precision = toPrecision(value, getPrecision(currency || symbol), false);
  const localePrecision = Number(precision).toLocaleString();
  if (isUnitPrice) usdtNumber = usdtNumber * precision;
  return (
    <Wrapper reverse={reverse} horizontal={horizontal}>
      <PairText value={localePrecision} unit={currency || symbol} />
      {usdt && !isNaN(usdtNumber) && (
        <UsdtWrapper horizontal={horizontal}>{`${
          usdtNumber === 0 ? "" : "≈ "
        }$${toLocaleStringWithFixed(usdtNumber, 2)}`}</UsdtWrapper>
      )}
    </Wrapper>
  );
};

export default Balance;
