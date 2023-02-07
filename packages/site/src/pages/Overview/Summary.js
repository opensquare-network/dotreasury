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

import {
  TEXT_DARK_ACCESSORY,
  TEXT_DARK_MAJOR,
  TEXT_DARK_MINOR,
} from "../../constants";
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
import { abbreviateBigNumber } from "../../utils";
import { h3_18_semibold, p_12_normal } from "../../styles/text";
import { space_x } from "../../styles/tailwindcss";

const Wrapper = styled(Card)`
  @media screen and (max-width: 1320px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
  }
  @media screen and (min-width: 1320px) {
    display: flex;
    justify-content: space-between;
  }
  padding: 31px;
  margin-bottom: 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const CustomCard = styled.div`
  padding: 0;
  border-color: #eee;
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  ${space_x(12)};
`;

const Title = styled(TextMinor)`
  line-height: 24px;
  ${p_12_normal};
`;

const TextBold = styled(Text)`
  ${h3_18_semibold};
`;

const TextAccessoryBold = styled(TextMinor)`
  ${h3_18_semibold};
  color: ${TEXT_DARK_ACCESSORY};
`;

const ValueSymbol = styled.span`
  color: ${TEXT_DARK_ACCESSORY};
`;
const Value = styled(Text)`
  ${h3_18_semibold};
`;
const ValueInfo = styled(Text)`
  ${p_12_normal};
  color: ${TEXT_DARK_ACCESSORY};
`;
const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  ${css`
    ${mrgap("4px")}
  `}
`;

const StyledLink = styled(Link)`
  color: ${TEXT_DARK_MINOR} !important;
  &:hover {
    ${TextAccessoryBold} {
      color: inherit;
    }
    text-decoration: underline;
  }
`;

const StyledLinkMajor = styled(Link)`
  color: ${TEXT_DARK_MAJOR} !important;
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

  return (
    <Wrapper>
      <CustomCard>
        <ItemWrapper>
          <Image src="/imgs/data-available.svg" />
          <div>
            <Title>Available</Title>
            <Value>
              {abbreviateBigNumber(treasury.free)}{" "}
              <ValueSymbol>{symbol}</ValueSymbol>
            </Value>
            <ValueInfo>usdt</ValueInfo>
          </div>
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper style={{ alignItems: "flex-start" }}>
          <Image src="/imgs/data-next-burn.svg" />
          <div>
            <Title>Next burn</Title>
            <Value>
              {abbreviateBigNumber(treasury.burnPercent * treasury.free)}{" "}
              <ValueSymbol>{symbol}</ValueSymbol>
            </Value>
          </div>
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper>
          <CountDown percent={spendPeriod.progress} />
          <div>
            <Title>Spend period</Title>
            <BlocksTime
              blocks={spendPeriod.restBlocks}
              ValueWrapper={TextBold}
              UnitWrapper={TextAccessoryBold}
              SectionWrapper={Fragment}
              TimeWrapper={ValueWrapper}
              unitMapper={{ d: "Day" }}
              pluralUnitMapper={{ d: "Days" }}
            />
            <ValueInfo>{spendPeriod.periodTime} days</ValueInfo>
          </div>
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper>
          <Image src="/imgs/data-proposals.svg" />
          <div>
            <Title>Proposals</Title>
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
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper>
          <Image src="/imgs/data-tips.svg" />
          <div>
            <Title>Tips</Title>
            <ValueWrapper>
              <StyledLinkMajor
                to={{
                  pathname: `/${symbolLowerCase}/tips`,
                  search: `?status=NewTip||tip`,
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
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper>
          <Image src="/imgs/data-bounties.svg" />
          <div>
            <Title>Bounties</Title>
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
        </ItemWrapper>
      </CustomCard>
    </Wrapper>
  );
};

export default Summary;
