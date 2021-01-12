import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import CountDown from "../../components/CountDown";
import TimePeriod from "../../components/TimePeriod";

import {
  fetchProposalsSummary,
  proposalSummarySelector,
} from "../../store/reducers/proposalSlice";
import {
  fetchSpendPeriod,
  spendPeriodSelector,
} from "../../store/reducers/chainSlice";

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
    dispatch(fetchSpendPeriod());
  }, [dispatch]);

  const summary = useSelector(proposalSummarySelector);
  const spendPeriod = useSelector(spendPeriodSelector);

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
          <TimePeriod time={spendPeriod.restTime}
            ValueWrapper={Value}
            UnitWrapper={Unit}
            SectionWrapper={Fragment}
            TimeWrapper={ValueWrapper}
            unitMapper={{d: "Days", h: "hrs"}}
          />
      </Item>
      <Item className="countdown">
        <CountDown percent={spendPeriod.progress} />
      </Item>
    </Wrapper>
  )
}

export default Summary;
