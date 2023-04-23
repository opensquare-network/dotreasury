import React from "react";
import styled from "styled-components";

import Card from "./Card";
import { Flex } from "./styled";

const CustomCard = styled(Card)`
  padding: 0;
  table {
    border: 0 !important;
    border-radius: 0 !important;
  }
  overflow: hidden;
  @media screen and (max-width: 600px) {
    overflow: visible;
  }
`;

const TitleWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  @media screen and (max-width: 640px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: var(--textPrimary);
`;

const Desc = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.3);
  margin-left: 8px;
`;

export default function DetailTableWrapper({ title, desc, buttons = null, children }) {
  return (
    <CustomCard>
      <TitleWrapper>
        <Flex>
          <Title>{title}</Title>
          {desc && <Desc>{desc}</Desc>}
        </Flex>
        {buttons}
      </TitleWrapper>
      {children}
    </CustomCard>
  );
}
