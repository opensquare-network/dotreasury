import React from "react";
import styled from "styled-components";

import User from "../../components/User";
import Circle from "./Circle";
import Label from "./Label";
import Bar from "./Bar";
import Card from "./Card";
import CardItem from "./CardItem";

const Wrapper = styled.div`
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

const Item = () => {
  return (
    <Wrapper>
      <FlexWrapper>
        <Circle />
        <TimeLableWrapper>
          <div>2020-12-12 09:43:41</div>
          <Label />
        </TimeLableWrapper>
      </FlexWrapper>
      <FlexWrapper>
        <Bar className="bar" />
        <Card>
          <CardItem title="Tipper">
            <User name="Eleanor" />
          </CardItem>
          <CardItem title="Beneficiary">
            <User name="Eleanor" />
          </CardItem>
        </Card>
      </FlexWrapper>
    </Wrapper>
  );
};

export default Item;
