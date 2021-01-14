import React from "react";
import styled from "styled-components";

import Text from "../../components/Text";

const Wrapper = styled.div`
  position: absolute;
  top: 16px;
`

const Title = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
`

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
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
