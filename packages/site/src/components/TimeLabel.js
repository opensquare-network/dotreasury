import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import TimeElapsed from "./TimeElapsed";
import Label from "./Label";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TimeLabel = ({ value }) => {
  return (
    <Wrapper>
      <Image src={"/imgs/time.svg"} />
      <Label><TimeElapsed from={value} /></Label>
    </Wrapper>
  );
};

export default TimeLabel;
