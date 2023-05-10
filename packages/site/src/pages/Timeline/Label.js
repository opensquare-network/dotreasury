import React from "react";
import styled, { css } from "styled-components";
import { stringCamlToWords } from "../../utils";

import { Image } from "semantic-ui-react";

const Wrapper = styled.div`
  display: flex;
  white-space: nowrap;
`;

const TipLabel = styled.a`
  display: flex;
  gap: 4px;
  background: var(--secondary);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: "Inter", serif;
  font-size: 12px;
  line-height: 20px;
  color: var(--primary);
  ${(p) =>
    !p.href &&
    css`
      cursor: default;
      pointer-events: none;
    `}
  &:hover {
    color: var(--primary);
  }
`;

const Label = ({ text, link = "" }) => {
  return (
    <Wrapper>
      <TipLabel href={link} target="_blank">
        <span>{stringCamlToWords(text)}</span>
        {link && <Image src={"/imgs/arrow.svg"} />}
      </TipLabel>
    </Wrapper>
  );
};

export default Label;
