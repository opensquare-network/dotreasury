import styled from "styled-components";
import OverviewTreasuryDetail from "./treasuryDetail";
import OverviewTotalTreasury from "./totalTreasury";
import { text_primary, space_y } from "../../../styles/tailwindcss";
import KusamaTreasuryProvider from "../../../context/KusamaTreasury";
import Card from "../../../components/Card";

const Wrapper = styled(Card)`
  padding: 24px;
  margin-bottom: 16px;
  ${space_y(24)}
  ${text_primary}
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: var(--neutral300);
`;

export default function OverviewKusama() {
  return (
    <KusamaTreasuryProvider>
      <Wrapper>
        <OverviewTotalTreasury />
        <Line />
        <OverviewTreasuryDetail />
      </Wrapper>
    </KusamaTreasuryProvider>
  );
}
