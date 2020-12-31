import React, {useState} from "react";
import styled, {css} from "styled-components";

import Circle from "./Circle"
import Bar from "./Bar"
import Item from "./Item"
import {PRIMARY_THEME_COLOR} from "../../constants"


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
  background-color: ${p => p.isUnfold ? "#FFE1E7" : PRIMARY_THEME_COLOR};
  opacity: ${p => p.isUnfold ? "1" : "0.5"};
`

const ItemWrapper = styled.div`
  flex-grow: 1;
  & > div:first-child .unfold-btn {
    display: block;
  }

  ${p => !p.isUnfold && css`
    & > div:not(:first-child) {
      display: none;
    }
    & > div:first-child .bar {
      visibility: hidden;
    }
  `}
`

const FoldableItem = ({data, polkassembly}) => {
  const [isUnfold, setIsUnfold] = useState(true);
  if (!data || data.length === 0) return null;
  const onUnfoldBtnClick = () => {
    setIsUnfold(!isUnfold);
  }
  return (
    <Wrapper>
      <VerticalWrapper>
        <FlexWrapper>
          <Circle />
          <HorizontalBar />
        </FlexWrapper>
        <FlexWrapper>
          <VerticalBar className="bar" isUnfold={isUnfold} />
        </FlexWrapper>
      </VerticalWrapper>
      <ItemWrapper isUnfold={isUnfold}>
        { (data || []).map((item, index) => <Item key={index} data={item} polkassembly={polkassembly} onUnfoldBtnClick={onUnfoldBtnClick} />) }
      </ItemWrapper>
    </Wrapper>
  )
}

export default FoldableItem;
