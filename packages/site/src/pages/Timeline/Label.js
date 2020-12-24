import React from "react";
import styled from "styled-components";

import { PRIMARY_THEME_COLOR, SECONDARY_THEME_COLOR } from "../../constants";

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const TipLabel = styled.span`
  background: ${SECONDARY_THEME_COLOR};
  padding: 2px 12px;
  border-radius: 4px;
  font-family: Inter;
  font-size: 12px;
  line-height: 20px;
  color: ${PRIMARY_THEME_COLOR};
`;

const Label = () => {
  return (
    <Wrapper>
      <TipLabel>tip</TipLabel>
    </Wrapper>
  );
};

export default Label;
