import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import Label from "./Label";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    margin-right: 4px;
  }
`;

const TimeLabel = ({ value }) => {
  return (
    <Wrapper>
      <Image src={"/imgs/time.svg"} />
      <Label>{value}</Label>
    </Wrapper>
  );
};

export default TimeLabel;
