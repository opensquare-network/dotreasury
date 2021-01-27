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
  spendPeriodSelector
} from "../../store/reducers/chainSlice";
import { mrgap } from "../../styles";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`

const CustomCard = styled(Card)`
  padding: 16px 20px;
  border-color: #EEE;
`

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  & > *:first-child {
    margin-right: 20px;
  }
`

const Title = styled(TextMinor)`
  line-height: 24px;
`

const TextBold = styled(Text)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
`

const TextMinorBold = styled(TextMinor)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  ${css`${mrgap("4px")}`}
`

const Summary = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpendPeriod());
  }, [dispatch]);

  const overview = useSelector(overviewSelector);
  const spendPeriod = useSelector(spendPeriodSelector);

  return (
    <Wrapper>
      <CustomCard>
        <ItemWrapper>
          <Image src="/imgs/blockchain-free-icon.svg" />
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
          <Image src="/imgs/blockchain-free-icon.svg" />
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
          <Image src="/imgs/blockchain-free-icon.svg" />
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
          <CountDown percent={spendPeriod.progress} />
          <div>
            <Title>Spend period</Title>
            <BlocksTime blocks={spendPeriod.restBlocks}
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
  )
}

export default Summary;
