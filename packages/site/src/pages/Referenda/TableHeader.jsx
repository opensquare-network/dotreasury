import React from "react";
import styled from "styled-components";
import Filter from "./Filter";
import Text from "../../components/Text";

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`;

export default function TableHeader({ setFilterTrack, setFilterStatus }) {
  return (
    <HeaderWrapper>
      <Title>OpenGov Applications</Title>
      <div style={{ display: "flex", gap: "16px" }}>
        <Filter setTrack={setFilterTrack} setStatus={setFilterStatus} />
      </div>
    </HeaderWrapper>
  );
}
