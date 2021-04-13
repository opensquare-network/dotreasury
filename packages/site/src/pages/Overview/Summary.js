import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Image } from "semantic-ui-react";

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
import { chainSymbolSelector } from "../../store/reducers/chainSlice"
import { mrgap } from "../../styles";

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

const Summary = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpendPeriod());
    dispatch(fetchTreasury());
  }, [dispatch]);

  const overview = useSelector(overviewSelector);
  const spendPeriod = useSelector(spendPeriodSelector);
  const treasury = useSelector(treasurySelector);
  const symbol = useSelector(chainSymbolSelector);

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
              <TextMinorBold>{overview.count.proposal.all}</TextMinorBold>
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
              <TextBold>{overview.count.tip.unFinished}</TextBold>
              <TextMinorBold>/</TextMinorBold>
              <TextMinorBold>{overview.count.tip.all}</TextMinorBold>
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
              <TextMinorBold>{overview.count.bounty.all}</TextMinorBold>
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
              <TextBold>{treasury.free?.toFixed(0)}</TextBold>
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
                {(treasury.burnPercent * treasury.free)?.toFixed(4)}
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
