import React from "react";
import styled from "styled-components";
import { getPrecision, toLocaleStringWithFixed, toPrecision } from "../utils";
import { CHAINS } from "../utils/chains";

const ExpenseWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
  white-space: nowrap;
`;

const PlusWrapper = styled.div`
  font-size: 14px !important;
  line-height: 22px !important;
  color: var(--textTertiary);
  margin: 0 4px;
  font-weight: 400 !important;
  :first-child {
    display: none;
  }
  :last-child {
    display: none;
  }
`;

const DollarWrapper = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: var(--textTertiary);
  white-space: nowrap;
`;

function NormalizedValue({ value, symbol }) {
  const precisionValue = toPrecision(value, getPrecision(symbol), false);
  const localeValue = Number(precisionValue).toLocaleString();

  return `${localeValue} ${(symbol || "").toUpperCase()}`;
}

export default function ProjectExpense({ expenseDot, expenseKsm, dollar }) {
  const numberDollar = Number(dollar);
  return (
    <div>
      <ExpenseWrapper className="project-expense-wrapper">
        {expenseDot > 0 && (
          <div>
            <NormalizedValue
              value={expenseDot}
              symbol={CHAINS.polkadot.symbol}
            />
          </div>
        )}
        <PlusWrapper>+</PlusWrapper>
        {expenseKsm > 0 && (
          <div>
            <NormalizedValue value={expenseKsm} symbol={CHAINS.kusama.symbol} />
          </div>
        )}
      </ExpenseWrapper>
      {!isNaN(numberDollar) && (
        <DollarWrapper>
          {`${numberDollar === 0 ? "" : "≈ "}$${toLocaleStringWithFixed(
            numberDollar,
            2,
          )}`}
        </DollarWrapper>
      )}
    </div>
  );
}
