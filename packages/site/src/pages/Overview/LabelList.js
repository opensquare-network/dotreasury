import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  @media screen and (max-width: 556px) {
    display: none;
  }
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
      <ItemList>
        {children}
      </ItemList>
    </Wrapper>
  )
}

export default LabelList;
