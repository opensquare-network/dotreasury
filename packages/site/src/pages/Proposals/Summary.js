import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import CountDown from "../../components/CountDown";

import {
  fetchProposalsSummary,
  proposalSummarySelector,
} from "../../store/reducers/proposalSlice";


const Wrapper = styled.div`
  background: #F8F8F8;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  flex-wrap: wrap;
  @media screen and (max-width: 556px) {
    justify-content: space-around;
    gap: 8px;
  }
`

const Item = styled.div`
  min-width: 120px;
  &.grow {
    flex-grow: 1;
  }
  &.countdown {
    min-width: 0;
  }
  &.right {
    text-align: right;
  }
  &.spend-period {
    min-width: 180px;
  }
  & > div:last-child {
    justify-content: flex-end;
  }
  
  @media screen and (max-width: 556px) {
    &.grow {
      flex-grow: 0;
    }
    &.countdown {
      display: none;
    }
    &.right {
      text-align: left;
    }
    &.spend-period {
      min-width: 120px;
    }
    & > div:last-child {
      justify-content: flex-start;
    }
  }
`

const Title = styled(TextMinor)`
  line-height: 24px;
`

const Value = styled(Text)`
  line-height: 32px;
  font-weight: bold;
  font-size: 18px;
`

const Unit = styled(TextMinor)`
  line-height: 32px;
  font-weight: bold;
  font-size: 18px;
`

const ValueWrapper = styled.div`
  display: flex;
  gap: 4px;
`

const Summary = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProposalsSummary());
  }, [dispatch]);

  const summary = useSelector(proposalSummarySelector);

  return (
    <Wrapper>
      <Item>
        <Title>Proposal</Title>
        <Value>{summary.numOfNewProposals}</Value>
      </Item>
      <Item>
        <Title>Total</Title>
        <Value>{summary.total}</Value>
      </Item>
      <Item className="grow">
        <Title>Awarded</Title>
        <Value>{summary.numOfAwarded}</Value>
      </Item>
      <Item className="right">
        <Title>Available</Title>
        <ValueWrapper>
          <Value>50.00</Value>
          <Unit>KSM</Unit>
        </ValueWrapper>
      </Item>
      <Item className="right">
        <Title>Next burn</Title>
        <ValueWrapper>
          <Value>3</Value>
          <Unit>KSM</Unit>
        </ValueWrapper>
      </Item>
      <Item className="right spend-period">
        <Title>Spend period</Title>
        <ValueWrapper>
          <Value>4</Value>
          <Unit>Days</Unit>
          <Value>10</Value>
          <Unit>hrs</Unit>
        </ValueWrapper>
      </Item>
      <Item className="countdown">
        <CountDown percent={25} />
      </Item>
    </Wrapper>
  )
}

export default Summary;
