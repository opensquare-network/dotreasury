import React from "react";
import styled from "styled-components";

import Card from "./Card";

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
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.9);
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
        <div style={{ display: "flex" }}>
          <Title>{title}</Title>
          {desc && <Desc>{desc}</Desc>}
        </div>
        {buttons}
      </TitleWrapper>
      {children}
    </CustomCard>
  );
}
