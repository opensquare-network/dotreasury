import React from "react";
import styled from "styled-components";

import User from "../../components/User/Index";
import Card from "../../components/Card";
import Circle from "./Circle";
import Label from "./Label";
import Bar from "./Bar";

import CardItem from "./CardItem";
import ButtonList from "./ButtonList";

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

const CardWrapper = styled.div`
  flex-grow: 1;
  margin: 8px 0 40px;
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
        <CardWrapper>
          <Card>
            <CardItem title="Tipper">
              <User name="Eleanor" />
            </CardItem>
            <CardItem title="Beneficiary">
              <User name="Eleanor" />
            </CardItem>
          </Card>
          <ButtonList />
        </CardWrapper>
      </FlexWrapper>
    </Wrapper>
  );
};

export default Item;
