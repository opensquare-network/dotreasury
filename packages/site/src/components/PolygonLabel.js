import React from "react";
import styled, { css } from "styled-components";
import { Image } from "semantic-ui-react";

import { TEXT_DARK_MAJOR, TEXT_DARK_MINOR } from "../constants";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.span`
  margin-left: 4px;
  font-family: "Inter";
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  color: ${TEXT_DARK_MINOR};
  ${(p) =>
    !p.noHover &&
    css`
      &:hover {
        color: ${TEXT_DARK_MAJOR};
        text-decoration-line: underline;
      }
    `}
`;

const PolygonLabel = ({ value, noHover }) => {
  return (
    <Wrapper>
      <Image src={"/imgs/polygon.svg"} />
      <Label noHover={noHover}>{value}</Label>
    </Wrapper>
  );
};

export default PolygonLabel;
