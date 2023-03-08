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
import { abbreviateBigNumber } from "../../utils";
import {
  gap_x,
  gap_y,
  grid,
  grid_cols,
  hidden,
  p,
} from "../../styles/tailwindcss";
import { breakpoint, lgcss } from "../../styles/responsive";
import { h3_18_semibold } from "../../styles/text";

const Wrapper = styled(Card)`
  ${p(24)};
  border-radius: 8px;
  margin-bottom: 16px;

  ${grid};
  ${grid_cols(8)};
  ${gap_x(16)};
  ${gap_y(8)};

  ${lgcss(grid_cols(7))};
  ${breakpoint(1140, grid_cols("auto-fit", 161.14))};

  .countdown {
    ${lgcss(hidden)};
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
`;

const Title = styled(TextMinor)`
  line-height: 24px;
  color: rgba(0, 0, 0, 0.3);
`;

const Value = styled(Text)`
  ${h3_18_semibold};
`;

const Unit = styled(TextMinor)`
  ${h3_18_semibold};
  color: rgba(0, 0, 0, 0.3);
`;

const ValueWrapper = styled.div`
  display: flex;
  ${h3_18_semibold};
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
      <Item>
        <Title>Available</Title>
        <ValueWrapper>
          <Value>{abbreviateBigNumber(treasury.free)}</Value>
          <Unit>{symbol}</Unit>
        </ValueWrapper>
      </Item>
      <Item className="next-burn">
        <Title>Next burn</Title>
        <ValueWrapper>
          <Value>
            {abbreviateBigNumber(treasury.burnPercent * treasury.free)}
          </Value>
          <Unit>{symbol}</Unit>
        </ValueWrapper>
      </Item>
      <Item className="spend-period">
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
