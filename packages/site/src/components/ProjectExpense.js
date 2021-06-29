import React from "react";
import styled from "styled-components";
import { toLocaleStringWithFixed } from "../utils";

const ExpenseWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
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
  text-align: right;
`;

export default function ProjectExpense({ expenseDot, expenseKsm, dollar }) {
  const numberDollar = Number(dollar);
  return (
    <div>
      <ExpenseWrapper>
        {expenseDot > 0 && <div>{`${expenseDot.toLocaleString()} DOT`}</div>}
        <PlusWrapper>+</PlusWrapper>
        {expenseKsm > 0 && <div>{`${expenseKsm.toLocaleString()} KSM`}</div>}
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
