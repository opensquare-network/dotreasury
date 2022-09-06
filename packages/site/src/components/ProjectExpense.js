import React from "react";
import styled from "styled-components";
import { getPrecision, toLocaleStringWithFixed, toPrecision } from "../utils";
import { CHAINS } from "../constants";

const ExpenseWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.9);
  white-space: nowrap;
`;

const PlusWrapper = styled.div`
  font-size: 14px !important;
  line-height: 22px !important;
  color: rgba(0, 0, 0, 0.3);
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
  color: rgba(0, 0, 0, 0.3);
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
            <NormalizedValue value={expenseDot} symbol={CHAINS.POLKADOT} />
          </div>
        )}
        <PlusWrapper>+</PlusWrapper>
        {expenseKsm > 0 && (
          <div>
            <NormalizedValue value={expenseKsm} symbol={CHAINS.KUSAMA} />
          </div>
        )}
      </ExpenseWrapper>
      {!isNaN(numberDollar) && (
        <DollarWrapper>
          {`${numberDollar === 0 ? "" : "≈ "}$${toLocaleStringWithFixed(
            numberDollar,
            2
          )}`}
        </DollarWrapper>
      )}
    </div>
  );
}
