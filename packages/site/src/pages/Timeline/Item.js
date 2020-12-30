import React from "react";
import styled from "styled-components";

import Card from "../../components/Card";
import Circle from "./Circle";
import Label from "./Label";
import Bar from "./Bar";

import CardItem from "./CardItem";
import ButtonList from "./ButtonList";
import DateShow from "../../components/DateShow";

const Wrapper = styled.div`
  max-width: 100%;
  &:last-child .bar {
    visibility: hidden;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const TimeLableWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardWrapper = styled.div`
  flex-grow: 1;
  margin: 8px 0 40px;
`;

const Item = ({ data, contentBuilder }) => {
  return (
    <Wrapper>
      <FlexWrapper>
        <Circle />
        <TimeLableWrapper>
          <div><DateShow value={data.extrinsic.extrinsicIndexer.blockTime} /></div>
          <Label text={data.extrinsic.name} />
        </TimeLableWrapper>
      </FlexWrapper>
      <FlexWrapper>
        <Bar className="bar" />
        <CardWrapper>
          <Card>
            { contentBuilder(data).map(({ title, value }, index) => <CardItem key={index} title={title}>{value}</CardItem>) }
          </Card>
          <ButtonList indexer={data.extrinsic.extrinsicIndexer} />
        </CardWrapper>
      </FlexWrapper>
    </Wrapper>
  );
};

export default Item;
