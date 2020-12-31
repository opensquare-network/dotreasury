import React from "react";
import styled from "styled-components";

import Card from "../../components/Card";
import Circle from "./Circle";
import Label from "./Label";
import Bar from "./Bar";

import CardItem from "./CardItem";
import ButtonList from "./ButtonList";
import DateShow from "../../components/DateShow";
import TextMinor from "../../components/TextMinor";

const Wrapper = styled.div`
  &:last-child .bar {
    visibility: hidden;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  gap: 12px;
  & > div:last-child {
    flex-grow: 1;
  }
`;

const VerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: sketch;
  & > div:last-child {
    flex-grow: 1;
  }
`

const TimeLableWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const CardWrapper = styled.div`
  flex-grow: 1;
  margin: 8px 0 32px;
`;

const UnfoldButton = styled.img`
  cursor: pointer;
  display: none;
`

const TextMinorWrapper = styled(TextMinor)`
  white-space: nowrap;
`

const Item = ({ data, polkassembly, onUnfoldBtnClick }) => {
  return (
    <Wrapper>
      <FlexWrapper>
        <VerticalWrapper>
          <Circle />
          <Bar className="bar" />
        </VerticalWrapper>
        <VerticalWrapper className="flex-grow">
        <FlexWrapper>
          <TimeLableWrapper>
            <TextMinorWrapper><DateShow value={data.extrinsicIndexer.blockTime} /></TextMinorWrapper>
            <Label text={data.name} />
          </TimeLableWrapper>
          <UnfoldButton src="/imgs/btn-unfold.svg" className="unfold-btn" onClick={onUnfoldBtnClick}  />
        </FlexWrapper>
          <CardWrapper>
            <Card>
              { data.fields.map(({ title, value }, index) => <CardItem key={index} title={title}>{value}</CardItem>) }
            </Card>
            <ButtonList indexer={data.extrinsicIndexer} polkassembly={polkassembly} />
          </CardWrapper>
        </VerticalWrapper>
      </FlexWrapper>
    </Wrapper>
  );
};

export default Item;
