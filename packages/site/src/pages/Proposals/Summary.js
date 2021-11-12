import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import CountDown from "../../components/CountDown";
import BlocksTime from "../../components/BlocksTime";
import { mrgap } from "../../styles";
import Card from "../../components/Card";

import {
  fetchProposalsSummary,
  proposalSummarySelector,
} from "../../store/reducers/proposalSlice";
import {
  chainSelector,
  chainSymbolSelector,
  fetchSpendPeriod,
  spendPeriodSelector,
} from "../../store/reducers/chainSlice";
import {
  fetchTreasury,
  treasurySelector,
} from "../../store/reducers/burntSlice";
import { toLocaleStringWithFixed } from "../../utils";

const Wrapper = styled(Card)`
  padding: 16px 20px 8px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  & > div:not(:last-child) {
    margin-right: 16px;
  }
  & > div {
    margin-bottom: 8px;
  }
  justify-content: space-between;
  flex-wrap: wrap;
  @media screen and (max-width: 1140px) {
    justify-content: flex-start;
  }
`;

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
  &.available,
  &.next-burn {
    min-width: 160px;
  }
  &.spend-period {
    min-width: 180px;
  }
  & > div:last-child {
    justify-content: flex-end;
  }

  @media screen and (max-width: 1140px) {
    &.grow {
      flex-grow: 0;
    }
    &.countdown {
      display: none;
    }
    &.right {
      text-align: left;
    }
    &.available,
    &.next-burn {
      min-width: 120px;
    }
    &.spend-period {
      min-width: 120px;
    }
    & > div:last-child {
      justify-content: flex-start;
    }
  }
`;

const Title = styled(TextMinor)`
  line-height: 24px;
`;

const Value = styled(Text)`
  line-height: 32px;
  font-weight: bold;
  font-size: 18px;
`;

const Unit = styled(TextMinor)`
  line-height: 32px;
  font-weight: bold;
  font-size: 18px;
`;

const ValueWrapper = styled.div`
  display: flex;
  ${css`
    ${mrgap("4px")}
  `}
`;

const Summary = () => {
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchProposalsSummary(chain));
    dispatch(fetchSpendPeriod(chain));
    dispatch(fetchTreasury(chain));
  }, [dispatch, chain]);

  const summary = useSelector(proposalSummarySelector);
  const spendPeriod = useSelector(spendPeriodSelector);
  const treasury = useSelector(treasurySelector);
  const symbol = useSelector(chainSymbolSelector);

  return (
    <Wrapper>
      <Item>
        <Title>Ongoing</Title>
        <Value>{summary.numOfOngoing}</Value>
      </Item>
      <Item>
        <Title>Approved</Title>
        <Value>{summary.numOfApproved}</Value>
      </Item>
      <Item>
        <Title>Awarded</Title>
        <Value>{summary.numOfAwarded}</Value>
      </Item>
      <Item className="grow">
        <Title>Total</Title>
        <Value>{summary.total}</Value>
      </Item>
      <Item className="right available">
        <Title>Available</Title>
        <ValueWrapper>
          <Value>{toLocaleStringWithFixed(treasury.free, 0)}</Value>
          <Unit>{symbol}</Unit>
        </ValueWrapper>
      </Item>
      <Item className="right next-burn">
        <Title>Next burn</Title>
        <ValueWrapper>
          <Value>
            {toLocaleStringWithFixed(treasury.burnPercent * treasury.free, 4)}
          </Value>
          <Unit>{symbol}</Unit>
        </ValueWrapper>
      </Item>
      <Item className="right spend-period">
        <Title>Spend period</Title>
        <BlocksTime
          blocks={spendPeriod.restBlocks}
          ValueWrapper={Value}
          UnitWrapper={Unit}
          SectionWrapper={Fragment}
          TimeWrapper={ValueWrapper}
          unitMapper={{ d: "Day" }}
          pluralUnitMapper={{ d: "Days" }}
        />
      </Item>
      <Item className="countdown">
        <CountDown percent={spendPeriod.progress} />
      </Item>
    </Wrapper>
  );
};

export default Summary;
