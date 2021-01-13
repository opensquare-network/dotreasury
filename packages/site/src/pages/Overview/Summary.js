import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Card from "../../components/Card";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import CountDown from "../../components/CountDown";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`

const CustomCard = styled(Card)`
  padding: 16px 20px;
`

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
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
  gap: 4px;
`

const Summary = () => {
  return (
    <Wrapper>
      <CustomCard>
        <ItemWrapper>
          <Image src="/imgs/blockchain-free-icon.svg" />
          <div>
            <Title>Proposals</Title>
            <ValueWrapper>
              <TextBold>10</TextBold>
              <TextMinorBold>/</TextMinorBold>
              <TextMinorBold>108</TextMinorBold>
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
              <TextBold>9</TextBold>
              <TextMinorBold>/</TextMinorBold>
              <TextMinorBold>183</TextMinorBold>
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
              <TextBold>1</TextBold>
              <TextMinorBold>/</TextMinorBold>
              <TextMinorBold>10</TextMinorBold>
            </ValueWrapper>
          </div>
        </ItemWrapper>
      </CustomCard>
      <CustomCard>
        <ItemWrapper>
          <CountDown percent={25} />
            <div>
              <Title>Spend period</Title>
              <ValueWrapper>
                <TextBold>4</TextBold>
                <TextMinorBold>Days</TextMinorBold>
                <TextBold>10</TextBold>
                <TextMinorBold>hrs</TextMinorBold>
              </ValueWrapper>
            </div>
        </ItemWrapper>
      </CustomCard>
    </Wrapper>
  )
}

export default Summary;
