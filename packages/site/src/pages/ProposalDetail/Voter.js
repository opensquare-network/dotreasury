import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import User from "../../components/User/Index";
import Text from "../../components/Text";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const PassWrapper = styled.div`
  display: flex;
  align-items: center;
  word-break: normal;
  gap: 8px;
`

const ImageWrapper = styled.div`
  width: 16px;
  height: 16px;
`

const VoterItem = ({address, agree, value}) => {
  return (
    <Wrapper>
      <User address={address} />
      <PassWrapper>
        <Text>{value}</Text>
        <ImageWrapper>
          <Image src={agree ? "/imgs/circle-pass.svg" : "/imgs/circle-reject.svg"} />
        </ImageWrapper>
      </PassWrapper>
    </Wrapper>
  )
}

export default VoterItem;
