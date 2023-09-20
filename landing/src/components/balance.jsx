// copied from site/src/components/balance.jsx
// without redux, chainSymbolSelector

import styled, { css } from "styled-components";

import PairText from "../../../site/src/components/PairText";
import {
  toPrecision,
  getPrecision,
  abbreviateBigNumber,
} from "../../../site/src/utils";
import { toLocaleStringWithFixed } from "../../../site/src/utils";
import { getChainSettings } from "../utils/chains";

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
        color: var(--textTertiary);
      }
      > :last-child {
        font-size: 14px;
        line-height: 22px;
        color: var(--textSecondary);
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
  color: var(--textTertiary);
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
  abbreviate = false,
  chain = "",
}) => {
  const { decimals, symbol } = getChainSettings(chain);
  let usdtNumber = Number(usdt);
  if (value === null || value === undefined) value = 0;
  const precision = toPrecision(
    value,
    currency ? getPrecision(currency) : decimals,
    false,
  );
  const localePrecision = Number(precision).toLocaleString();
  if (isUnitPrice) usdtNumber = usdtNumber * precision;

  let displayValue = localePrecision;
  let displayPrice = usdtNumber;

  if (abbreviate && Number(precision) > 1000000) {
    displayValue = abbreviateBigNumber(precision, 2);
    displayPrice = abbreviateBigNumber(usdtNumber, 2);
  }

  return (
    <Wrapper reverse={reverse} horizontal={horizontal}>
      <PairText value={displayValue} unit={currency || symbol} />
      {usdt && !isNaN(usdtNumber) && (
        <UsdtWrapper horizontal={horizontal}>{`${
          usdtNumber === 0 ? "" : "≈ "
        }$${toLocaleStringWithFixed(displayPrice, 2)}`}</UsdtWrapper>
      )}
    </Wrapper>
  );
};

export default Balance;
