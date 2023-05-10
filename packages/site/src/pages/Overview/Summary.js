import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

import Card from "../../components/Card";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import CountDown from "../../components/CountDown";
import BlocksTime from "../../components/BlocksTime";

import { overviewSelector } from "../../store/reducers/overviewSlice";
import {
  fetchSpendPeriod,
  spendPeriodSelector,
} from "../../store/reducers/chainSlice";
import {
  fetchTreasury,
  treasurySelector,
} from "../../store/reducers/burntSlice";
import {
  chainSelector,
  chainSymbolSelector,
} from "../../store/reducers/chainSlice";
import { mrgap } from "../../styles";
import { abbreviateBigNumber, getPrecision, toPrecision } from "../../utils";
import { h3_18_semibold, p_12_normal } from "../../styles/text";
import {
  gap_x,
  gap_y,
  grid,
  grid_cols,
  p,
  rounded_none,
} from "../../styles/tailwindcss";
import { breakpoint, smcss } from "../../styles/responsive";
import { useIsKusamaChain } from "../../utils/hooks/chain";
import { extractTime } from "@polkadot/util";
import { parseEstimateTime } from "../../utils/parseEstimateTime";
import BigNumber from "bignumber.js";
import SummaryItem from "../../components/Summary/Item";

const Wrapper = styled(Card)`
  margin-bottom: 16px;

  ${p(24)};
  ${grid};
  ${gap_x(128)};
  ${gap_y(16)};
  ${grid_cols("auto-fit", 210)};

  ${smcss(grid_cols(2))};
  ${breakpoint(600, rounded_none)};
`;

const TextBold = styled(Text)`
  ${h3_18_semibold};
`;

const TextAccessoryBold = styled(TextMinor)`
  ${h3_18_semibold};
  color: var(--textTertiary);
`;

const ValueInfo = styled(Text)`
  ${p_12_normal};
  color: var(--textTertiary);
`;
const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  ${css`
    ${mrgap("4px")}
  `}
`;

const StyledLink = styled(Link)`
  color: var(--textSecondary) !important;
  &:hover {
    ${TextAccessoryBold} {
      color: inherit;
    }
    text-decoration: underline;
  }
`;

const StyledLinkMajor = styled(Link)`
  color: var(--textPrimary) !important;
  &:hover {
    text-decoration: underline;
  }
`;

const Summary = () => {
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchSpendPeriod(chain));
    dispatch(fetchTreasury(chain));
  }, [dispatch, chain]);

  const overview = useSelector(overviewSelector);
  const spendPeriod = useSelector(spendPeriodSelector);
  const treasury = useSelector(treasurySelector);
  const symbol = useSelector(chainSymbolSelector);
  const symbolLowerCase = symbol?.toLowerCase();
  const isKusama = useIsKusamaChain();

  const precision = getPrecision(symbol);

  const symbolPrice = overview?.latestSymbolPrice ?? 0;
  const toBeAwarded = BigNumber(overview?.toBeAwarded?.total ?? 0).toNumber();
  const toBeAwardedValue = BigNumber(
    toPrecision(toBeAwarded, precision),
  ).toNumber();

  return (
    <Wrapper>
      <SummaryItem
        icon={<Image src="/imgs/data-available.svg" />}
        title="Available"
        content={
          <div>
            <ValueWrapper>
              <TextBold>{abbreviateBigNumber(treasury.free)}</TextBold>
              <TextAccessoryBold>{symbol}</TextAccessoryBold>
            </ValueWrapper>
            <ValueInfo>
              {!!treasury.free && "≈ "}$
              {abbreviateBigNumber(treasury.free * symbolPrice)}
            </ValueInfo>
          </div>
        }
      />
      <SummaryItem
        icon={<Image src="/imgs/data-approved.svg" />}
        title="To be awarded"
        content={
          <div>
            <ValueWrapper>
              <TextBold>{abbreviateBigNumber(toBeAwardedValue)}</TextBold>
              <TextAccessoryBold>{symbol}</TextAccessoryBold>
            </ValueWrapper>
            <ValueInfo>
              {!!toBeAwardedValue && "≈ "}$
              {abbreviateBigNumber(toBeAwardedValue * symbolPrice)}
            </ValueInfo>
          </div>
        }
      />
      <SummaryItem
        icon={<Image src="/imgs/data-next-burn.svg" />}
        title="Next burn"
        content={
          <div>
            <ValueWrapper>
              <TextBold>
                {abbreviateBigNumber(treasury.burnPercent * treasury.free)}
              </TextBold>
              <TextAccessoryBold>{symbol}</TextAccessoryBold>
            </ValueWrapper>
          </div>
        }
      />
      <SummaryItem
        icon={<CountDown percent={spendPeriod.progress} />}
        title="Spend period"
        content={
          <div>
            <BlocksTime
              blocks={spendPeriod.restBlocks}
              ValueWrapper={TextBold}
              UnitWrapper={TextAccessoryBold}
              SectionWrapper={Fragment}
              TimeWrapper={ValueWrapper}
              unitMapper={{ d: "Day" }}
              pluralUnitMapper={{ d: "Days" }}
            />
            <ValueInfo>
              {parseEstimateTime(extractTime(spendPeriod.periodTime))}
            </ValueInfo>
          </div>
        }
      />

      {isKusama && (
        <SummaryItem
          icon={<Image src="/imgs/data-opengov.svg" />}
          title="OpenGov"
          content={
            <div>
              <ValueWrapper>
                <TextBold>{overview.count.referenda.unFinished ?? 0}</TextBold>
                <TextAccessoryBold>/</TextAccessoryBold>
                <StyledLink to={`/${symbolLowerCase}/referenda`}>
                  <TextAccessoryBold>
                    {overview.count.referenda.all}
                  </TextAccessoryBold>
                </StyledLink>
              </ValueWrapper>
            </div>
          }
        />
      )}

      <SummaryItem
        icon={<Image src="/imgs/data-proposals.svg" />}
        title="Proposals"
        content={
          <div>
            <ValueWrapper>
              <TextBold>{overview.count.proposal.unFinished}</TextBold>
              <TextAccessoryBold>/</TextAccessoryBold>
              <StyledLink to={`/${symbolLowerCase}/proposals`}>
                <TextAccessoryBold>
                  {overview.count.proposal.all}
                </TextAccessoryBold>
              </StyledLink>
            </ValueWrapper>
          </div>
        }
      />
      <SummaryItem
        icon={<Image src="/imgs/data-tips.svg" />}
        title="Tips"
        content={
          <div>
            <ValueWrapper>
              <StyledLinkMajor
                to={{
                  pathname: `/${symbolLowerCase}/tips`,
                  search: "?status=NewTip||tip",
                }}
              >
                <TextBold>{overview.count.tip.unFinished}</TextBold>
              </StyledLinkMajor>
              <TextAccessoryBold>/</TextAccessoryBold>
              <StyledLink to={`/${symbolLowerCase}/tips`}>
                <TextAccessoryBold>{overview.count.tip.all}</TextAccessoryBold>
              </StyledLink>
            </ValueWrapper>
          </div>
        }
      />
      <SummaryItem
        icon={<Image src="/imgs/data-bounties.svg" />}
        title="Bounties"
        content={
          <div>
            <ValueWrapper>
              <TextBold>{overview.count.bounty.unFinished}</TextBold>
              <TextAccessoryBold>/</TextAccessoryBold>
              <StyledLink to={`/${symbolLowerCase}/bounties`}>
                <TextAccessoryBold>
                  {overview.count.bounty.all}
                </TextAccessoryBold>
              </StyledLink>
            </ValueWrapper>
          </div>
        }
      />
    </Wrapper>
  );
};

export default Summary;
