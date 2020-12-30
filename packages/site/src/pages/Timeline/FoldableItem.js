import React from "react";
import styled from "styled-components";

import Circle from "./Circle"
import Bar from "./Bar"


const Wrapper = styled.div`
  display: flex;
`

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`

const VerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: sketch;
  & > div:last-child {
    flex-grow: 1;
  }
`

const HorizontalBar = styled(Bar)`
  height: 2px;
  width: 8px;
  margin: 11px 0;
`

const VerticalBar = styled(Bar)`
  height: 100%;
`

const ChildrenWrapper = styled.div`
  flex-grow: 1;
`

const FoldableItem = ({children}) => {
  return (
    <Wrapper>
      <VerticalWrapper>
        <FlexWrapper>
          <Circle />
          <HorizontalBar />
        </FlexWrapper>
        <FlexWrapper>
          <VerticalBar className="bar" />
        </FlexWrapper>
      </VerticalWrapper>
      <ChildrenWrapper>
        {children}
      </ChildrenWrapper>
    </Wrapper>
  )
}

export default FoldableItem;
