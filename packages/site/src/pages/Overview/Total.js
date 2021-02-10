import React from "react";
import styled from "styled-components";

import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TextWrapper = styled.div`
  display: flex;
  align-items:center;
`

const TextBold = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  line-height: 32px;
`

const TextMinorBold = styled(TextMinor)`
  font-size: 18px;
  font-weight: 700;
  line-height: 32px;
  margin-left: 8px;
`

const TotalText = styled(TextMinor)`
  text-align: center;
`

const Total = ({total, children}) => {
  return (
    <Wrapper>
      {children}
      <div>
        <TextWrapper>
          <TextBold>{total}</TextBold>
          <TextMinorBold>KSM</TextMinorBold>
        </TextWrapper>
        <TotalText>Total amount</TotalText>
      </div>
    </Wrapper>
  )
}

export default Total;
