import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
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
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { mrgap } from "../../styles";
import { abbreviateBigNumber, getPrecision, toPrecision } from "../../utils";
import { h3_18_semibold, h4_16_semibold, p_12_normal } from "../../styles/text";
import {
  gap_x,
  gap_y,
  grid,
  grid_cols,
  p,
  rounded_none,
} from "../../styles/tailwindcss";
import { breakpoint, smcss, mdcss, lgcss } from "../../styles/responsive";
import { extractTime } from "@polkadot/util";
import { parseEstimateTime } from "../../utils/parseEstimateTime";
import BigNumber from "bignumber.js";
import SummaryItem from "../../components/Summary/Item";
import ImageWithDark from "../../components/ImageWithDark";
import { currentChainSettings, isCentrifuge } from "../../utils/chains";
import useFiatPrice from "../../hooks/useFiatPrice";

const Wrapper = styled(Card)`
  margin-bottom: 16px;

  ${p(24)};
`;

const Title = styled.h4`
  ${h4_16_semibold};
  display: flex;
  column-gap: 8px;
  margin-bottom: 24px;
`;

const SummaryWrapper = styled.div`
  ${grid};
  ${gap_x(128)};
  ${gap_y(8)};
  ${grid_cols(4)};

  ${mdcss(grid_cols(3))};
  ${smcss(grid_cols(2))};
  ${lgcss(gap_x(16))};
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

export function SpendPeriodItem() {
  const dispatch = useDispatch();
  const spendPeriod = useSelector(spendPeriodSelector);

  useEffect(() => {
    dispatch(fetchSpendPeriod());
  }, [dispatch]);

  return (
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
  );
}

export function ToBeAwardedItem() {
  const overview = useSelector(overviewSelector);
  const symbol = useSelector(chainSymbolSelector);
  const { price: symbolPrice } = useFiatPrice();

  const precision = getPrecision(symbol);
  const toBeAwarded = BigNumber(overview?.toBeAwarded?.total ?? 0).toNumber();
  const toBeAwardedValue = BigNumber(
    toPrecision(toBeAwarded, precision),
  ).toNumber();

  return (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-approved.svg" />}
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
  );
}

export function BurntItem({ treasury }) {
  const symbol = useSelector(chainSymbolSelector);

  if (!currentChainSettings?.hasBurnt) {
    return null;
  }

  return (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-next-burn.svg" />}
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
  );
}

const Summary = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTreasury());
  }, [dispatch]);

  const overview = useSelector(overviewSelector);
  const treasury = useSelector(treasurySelector);
  const symbol = useSelector(chainSymbolSelector);
  const { price: symbolPrice } = useFiatPrice();

  const availableItem = (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-available.svg" />}
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
  );
  const opengovItem = currentChainSettings.supportOpenGov && (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-opengov.svg" />}
      title="OpenGov"
      content={
        <div>
          <ValueWrapper>
            <TextBold>{overview.count.referenda.unFinished ?? 0}</TextBold>
            <TextAccessoryBold>/</TextAccessoryBold>
            <StyledLink to={"/referenda"}>
              <TextAccessoryBold>
                {overview.count.referenda.all}
              </TextAccessoryBold>
            </StyledLink>
          </ValueWrapper>
        </div>
      }
    />
  );
  const proposalsItem = (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-proposals.svg" />}
      title="Proposals"
      content={
        <div>
          <ValueWrapper>
            <TextBold>{overview.count.proposal.unFinished}</TextBold>
            <TextAccessoryBold>/</TextAccessoryBold>
            <StyledLink to={"/proposals"}>
              <TextAccessoryBold>
                {overview.count.proposal.all}
              </TextAccessoryBold>
            </StyledLink>
          </ValueWrapper>
        </div>
      }
    />
  );
  const tipsItem = currentChainSettings.hasTips && (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-tips.svg" />}
      title="Tips"
      content={
        <div>
          <ValueWrapper>
            <StyledLinkMajor
              to={{
                pathname: "/tips",
                search: "?status=NewTip||tip",
              }}
            >
              <TextBold>{overview.count.tip.unFinished}</TextBold>
            </StyledLinkMajor>
            <TextAccessoryBold>/</TextAccessoryBold>
            <StyledLink to={"/tips"}>
              <TextAccessoryBold>{overview.count.tip.all}</TextAccessoryBold>
            </StyledLink>
          </ValueWrapper>
        </div>
      }
    />
  );
  const bountiesItem = currentChainSettings.hasBounties && (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-bounties.svg" />}
      title="Bounties"
      content={
        <div>
          <ValueWrapper>
            <TextBold>{overview.count.bounty.unFinished}</TextBold>
            <TextAccessoryBold>/</TextAccessoryBold>
            <StyledLink to={"/bounties"}>
              <TextAccessoryBold>{overview.count.bounty.all}</TextAccessoryBold>
            </StyledLink>
          </ValueWrapper>
        </div>
      }
    />
  );

  const sortedItems = [
    availableItem,
    <ToBeAwardedItem />,
    <BurntItem treasury={treasury} />,
    !isCentrifuge && <SpendPeriodItem />,
    opengovItem,
    proposalsItem,
    isCentrifuge && <SpendPeriodItem />,
    tipsItem,
    bountiesItem,
  ]
    .filter(Boolean)
    .map((item, idx) => <Fragment key={idx}>{item}</Fragment>);

  return (
    <Wrapper>
      {currentChainSettings.hasAssetHub && (
        <Title>
          <img src="/imgs/chains-polkadot.svg" alt="" />
          Polkadot
        </Title>
      )}

      <SummaryWrapper>{sortedItems}</SummaryWrapper>
    </Wrapper>
  );
};

export default Summary;
