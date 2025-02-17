import styled from "styled-components";
import OverviewTreasuryDetail from "./treasuryDetail";
import OverviewTotalTreasury from "./totalTreasury";
import { space_y, m_b } from "../../../styles/tailwindcss";
import KusamaTreasuryProvider from "../../../context/KusamaTreasury";

const Wrapper = styled.div`
  ${space_y(16)}
  ${m_b(16)}
`;

export default function OverviewKusama() {
  return (
    <KusamaTreasuryProvider>
      <Wrapper>
        <OverviewTotalTreasury />
        <OverviewTreasuryDetail />
      </Wrapper>
    </KusamaTreasuryProvider>
  );
}
