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

import { TEXT_DARK_MAJOR, TEXT_DARK_MINOR } from "../../constants";
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
import { toLocaleStringWithFixed } from "../../utils";

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
  & > *:first-child {
    margin-right: 20px;
  }
`;

const Title = styled(TextMinor)`
  line-height: 24px;
`;

const TextBold = styled(Text)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
`;

const TextMinorBold = styled(TextMinor)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
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
          <Image src="/imgs/data-proposals.svg" />
          <div>
            <Title>Proposals</Title>
            <ValueWrapper>
              <TextBold>{overview.count.proposal.unFinished}</TextBold>
              <TextMinorBold>/</TextMinorBold>
              <StyledLink to={`/${symbolLowerCase}/proposals`}>
                <TextMinorBold>{overview.count.proposal.all}</TextMinorBold>
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
              <TextMinorBold>/</TextMinorBold>
              <StyledLink to={`/${symbolLowerCase}/tips`}>
                <TextMinorBold>{overview.count.tip.all}</TextMinorBold>
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
              <TextMinorBold>/</TextMinorBold>
              <StyledLink to={`/${symbolLowerCase}/bounties`}>
                <TextMinorBold>{overview.count.bounty.all}</TextMinorBold>
              </StyledLink>
            </ValueWrapper>
          </div>
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper>
          <Image src="/imgs/data-available.svg" />
          <div>
            <Title>Available</Title>
            <ValueWrapper>
              <TextBold>{toLocaleStringWithFixed(treasury.free, 0)}</TextBold>
              <TextMinorBold>{symbol}</TextMinorBold>
            </ValueWrapper>
          </div>
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper>
          <Image src="/imgs/data-next-burn.svg" />
          <div>
            <Title>Next burn</Title>
            <ValueWrapper>
              <TextBold>
                {toLocaleStringWithFixed(
                  treasury.burnPercent * treasury.free,
                  4
                )}
              </TextBold>
              <TextMinorBold>{symbol}</TextMinorBold>
            </ValueWrapper>
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
              UnitWrapper={TextMinorBold}
              SectionWrapper={Fragment}
              TimeWrapper={ValueWrapper}
              unitMapper={{ d: "Day" }}
              pluralUnitMapper={{ d: "Days" }}
            />
          </div>
        </ItemWrapper>
      </CustomCard>
    </Wrapper>
  );
};

export default Summary;
