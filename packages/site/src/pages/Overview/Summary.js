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
import { abbreviateBigNumber, toPrecision } from "../../utils";
import { h3_18_semibold, p_12_normal } from "../../styles/text";
import {
  gap_x,
  grid,
  grid_cols,
  hidden,
  p,
  p_y,
  rounded_none,
  space_x,
} from "../../styles/tailwindcss";
import { getDecimalByChain } from "@osn/common";
import { breakpoint, smcss } from "../../styles/responsive";
import { useIsKusamaChain } from "../../utils/hooks/chain";
import { extractTime } from "@polkadot/util";
import { parseEstimateTime } from "../../utils/parseEstimateTime";

const Wrapper = styled(Card)`
  margin-bottom: 24px;

  ${p(24)};
  ${grid};
  ${gap_x(64)};
  ${grid_cols("auto-fit", 258)};

  ${smcss(grid_cols(2))};
  ${breakpoint(600, rounded_none)};
`;

const CustomCard = styled.div`
  ${p_y(8)};
  border-color: #eee;
`;

const ItemIconWrapper = styled.div``;
const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  ${space_x(12)};

  ${ItemIconWrapper} {
    ${smcss(hidden)};
  }
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
  const decimal = getDecimalByChain(chain);

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

  const price = overview?.latestSymbolPrice ?? 0;
  const toBeAwarded = overview?.toBeAwarded ?? 0;

  return (
    <Wrapper>
      <CustomCard>
        <ItemWrapper>
          <ItemIconWrapper>
            <Image src="/imgs/data-available.svg" />
          </ItemIconWrapper>
          <div>
            <Title>Available</Title>
            <ValueWrapper>
              <TextBold>{abbreviateBigNumber(treasury.free)}</TextBold>
              <TextAccessoryBold>{symbol}</TextAccessoryBold>
            </ValueWrapper>
            <ValueInfo>${abbreviateBigNumber(treasury.free * price)}</ValueInfo>
          </div>
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper>
          <ItemIconWrapper>
            <Image src="/imgs/data-approved.svg" />
          </ItemIconWrapper>
          <div>
            <Title>To be awarded</Title>
            <ValueWrapper>
              <TextBold>{abbreviateBigNumber(toBeAwarded)}</TextBold>
              <TextAccessoryBold>{symbol}</TextAccessoryBold>
            </ValueWrapper>
            <ValueInfo>
              ${abbreviateBigNumber(toPrecision(toBeAwarded, decimal) * price)}
            </ValueInfo>
          </div>
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper style={{ alignItems: "flex-start" }}>
          <ItemIconWrapper>
            <Image src="/imgs/data-next-burn.svg" />
          </ItemIconWrapper>
          <div>
            <Title>Next burn</Title>
            <ValueWrapper>
              <TextBold>
                {abbreviateBigNumber(treasury.burnPercent * treasury.free)}
              </TextBold>
              <TextAccessoryBold>{symbol}</TextAccessoryBold>
            </ValueWrapper>
          </div>
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper>
          <ItemIconWrapper>
            <CountDown percent={spendPeriod.progress} />
          </ItemIconWrapper>
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
            <ValueInfo>
              {parseEstimateTime(extractTime(spendPeriod.periodTime))}
            </ValueInfo>
          </div>
        </ItemWrapper>
      </CustomCard>

      {isKusama && (
        <CustomCard>
          <ItemWrapper>
            <ItemIconWrapper>
              <Image src="/imgs/data-opengov.svg" />
            </ItemIconWrapper>
            <div>
              <Title>OpenGov</Title>
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
          </ItemWrapper>
        </CustomCard>
      )}

      <CustomCard>
        <ItemWrapper>
          <ItemIconWrapper>
            <Image src="/imgs/data-proposals.svg" />
          </ItemIconWrapper>
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
          <ItemIconWrapper>
            <Image src="/imgs/data-tips.svg" />
          </ItemIconWrapper>
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
          <ItemIconWrapper>
            <Image src="/imgs/data-bounties.svg" />
          </ItemIconWrapper>
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
