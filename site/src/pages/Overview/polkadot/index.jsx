import styled from "styled-components";
import OverviewTreasuryDetail from "./treasuryDetail";
import OverviewTotalTreasury from "./totalTreasury";
import { grid, grid_cols, space_y } from "../../../styles/tailwindcss";
import TopBeneficiariesTable from "../TopBeneficiariesTable";
import { mdcss } from "../../../styles/responsive";
import TopFundedProjectsTable from "../topFundedProjectsTable";
import PolkadotTreasuryProvider from "../../../context/PolkadotTreasury";

const Wrapper = styled.div`
  ${space_y(16)}
`;

const TableWrapper = styled.div`
  ${grid}
  ${grid_cols(2)}
  gap: 16px;
  ${mdcss(grid_cols(1))}
`;

export default function OverviewPolkadot() {
  return (
    <PolkadotTreasuryProvider>
      <Wrapper>
        <OverviewTotalTreasury />

        <OverviewTreasuryDetail />

        <TableWrapper>
          <TopBeneficiariesTable />
          <TopFundedProjectsTable />
        </TableWrapper>
      </Wrapper>
    </PolkadotTreasuryProvider>
  );
}
