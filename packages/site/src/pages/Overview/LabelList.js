import React from "react";
import styled from "styled-components";

import Text from "../../components/Text";

const Wrapper = styled.div`
  @media screen and (max-width: 556px) {
    display: none;
  }
`

const Title = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
`

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  & > div:not(:last-child) {
    margin-bottom: 8px;
  }
`

const LabelList = ({children}) => {
  return (
    <Wrapper>
      <Title>Output</Title>
      <ItemList>
        {children}
      </ItemList>
    </Wrapper>
  )
}

export default LabelList;
