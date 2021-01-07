import React from "react";
import styled from "styled-components";

import Circle from "./Circle";
import Text from "../Text";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
`

const BigText = styled(Text)`
  margin-top: 8px;
  font-size: 20px;
`

const CountDown = () => {
  return (
    <Wrapper>
      <TextWrapper>
        <Text>启动期</Text>
        <BigText>7天</BigText>
        <Text>5天14小时</Text>
      </TextWrapper>
      <Circle percent={80} />
    </Wrapper>
  )
}

export default CountDown;
