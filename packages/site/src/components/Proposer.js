import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Voter from "./Voter";
import BarProgress from "./BarProgress";
import TextMinor from "./TextMinor";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const BarProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CustomText = styled(TextMinor)`
  white-space: nowrap;
`

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const AyeNayWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Proposer = ({address, agree, value, threshold, ayes, nays }) => {
  return (
    <Wrapper>
      <Voter address={address} agree={agree} value={value} />
      <BarProgressWrapper>
        <BarProgress current={ayes} total={threshold} />
        <TextWrapper>
          <CustomText>{`${ayes}/${threshold}`}</CustomText>
          <AyeNayWrapper>
            <ItemWrapper>
              <CustomText>Aye ({ayes})</CustomText>
              <Image src="/imgs/aye.svg" />
            </ItemWrapper>
            <ItemWrapper>
            <CustomText>Nays ({nays})</CustomText>
              <Image src="/imgs/nay.svg" />
            </ItemWrapper>
          </AyeNayWrapper>
        </TextWrapper>
      </BarProgressWrapper>
    </Wrapper>
  )
}

export default Proposer;
