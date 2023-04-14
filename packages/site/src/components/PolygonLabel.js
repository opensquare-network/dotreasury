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
  line-height: 24px;
  color: ${TEXT_DARK_MINOR};
  ${(p) => css`
    font-size: ${p.fontSize}px;
  `}
  ${(p) =>
    !p.noHover &&
    css`
      &:hover {
        color: var(--textPrimary);
        text-decoration-line: underline;
      }
    `}
`;

const PolygonLabel = ({ value, noHover, fontSize = 14 }) => {
  return (
    <Wrapper>
      <Image src={"/imgs/polygon.svg"} />
      <Label noHover={noHover} fontSize={fontSize}>
        {value}
      </Label>
    </Wrapper>
  );
};

export default PolygonLabel;
