import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import PairText from "../../components/PairText";
import TextMinor from "../../components/TextMinor";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

const DollarText = styled(TextMinor)`
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const ExpenseCell = ({ expense, dollar }) => {
  const symbol = useSelector(chainSymbolSelector);
  return (
    <Wrapper>
      <PairText value={expense} unit={symbol} />
      {dollar && dollar > 0 && <DollarText>{`≈ $${parseFloat(dollar).toFixed(2).replace(/\D00/, "")}`}</DollarText>}
    </Wrapper>
  )
}

export default ExpenseCell;
