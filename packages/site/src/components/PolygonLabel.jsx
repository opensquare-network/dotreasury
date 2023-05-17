import React from "react";
import styled, { css } from "styled-components";
import IconMask from "./Icon/Mask";

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
  color: var(--textTertiary);
  ${(p) => css`
    font-size: ${p.fontSize}px;
  `}
  ${(p) =>
    !p.noHover &&
    css`
      &:hover {
        text-decoration-line: underline;
      }
    `}
`;

const PolygonLabel = ({ value, noHover, fontSize = 14 }) => {
  return (
    <Wrapper>
      <IconMask src={"/imgs/polygon.svg"} size={16} color="textDisable" />
      <Label noHover={noHover} fontSize={fontSize}>
        {value}
      </Label>
    </Wrapper>
  );
};

export default PolygonLabel;
