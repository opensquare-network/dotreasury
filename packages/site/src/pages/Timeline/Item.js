import React from "react";
import styled from "styled-components";

import Circle from "./Circle";
import Label from "./Label";
import Bar from "./Bar";
import Card from "./Card";

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
    <>
      <FlexWrapper>
        <Circle />
        <TimeLableWrapper>
          <div>2020-12-12 09:43:41</div>
          <Label />
        </TimeLableWrapper>
      </FlexWrapper>
      <FlexWrapper>
        <Bar />
        <Card>123</Card>
      </FlexWrapper>
    </>
  );
};

export default Item;
