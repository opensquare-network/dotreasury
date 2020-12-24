import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const TipLabel = styled.span`
  background: #ffecef;
  padding: 2px 12px;
  border-radius: 4px;
  font-family: Inter;
  font-size: 12px;
  line-height: 20px;
  color: #df405d;
`;

const Label = () => {
  return (
    <Wrapper>
      <TipLabel>tip</TipLabel>
    </Wrapper>
  );
};

export default Label;
