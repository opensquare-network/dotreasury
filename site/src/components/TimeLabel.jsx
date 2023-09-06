import React from "react";
import styled from "styled-components";
import Label from "./Label";
import IconMask from "./Icon/Mask";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  i,
  img {
    margin-right: 4px;
  }
`;

const TimeLabel = ({ value }) => {
  return (
    <Wrapper>
      <IconMask src={"/imgs/time.svg"} size={16} color="textDisable" />
      <Label>{value}</Label>
    </Wrapper>
  );
};

export default TimeLabel;
