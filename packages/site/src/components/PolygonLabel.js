import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import {TEXT_DARK_MAJOR, TEXT_DARK_MINOR} from "../constants"

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Label = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  color: ${TEXT_DARK_MINOR};
  &:hover {
    color: ${TEXT_DARK_MAJOR};
    text-decoration-line: underline;
  }
`;

const PolygonLabel = ({ value }) => {
  return (
    <Wrapper>
      <Image src={"/imgs/polygon.svg"} />
      <Label>{value}</Label>
    </Wrapper>
  );
};

export default PolygonLabel;
