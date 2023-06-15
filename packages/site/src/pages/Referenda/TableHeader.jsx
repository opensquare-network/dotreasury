import React from "react";
import styled from "styled-components";
import Text from "../../components/Text";

const HeaderWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`;

export default function TableHeader() {
  return (
    <HeaderWrapper>
      <Title>OpenGov Applications</Title>
    </HeaderWrapper>
  );
}
