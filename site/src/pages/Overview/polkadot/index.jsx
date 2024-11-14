import styled from "styled-components";
import OverviewTreasuryDetail from "./treasuryDetail";
import OverviewTotalTreasury from "./totalTreasury";
import { space_y } from "../../../styles/tailwindcss";
import { isCentrifuge } from "../../../utils/chains";
import TopBeneficiariesTable from "../TopBeneficiariesTable";

const Wrapper = styled.div`
  ${space_y(16)}
`;

export default function OverviewPolkadot() {
  return (
    <Wrapper>
      <OverviewTotalTreasury />

      <OverviewTreasuryDetail />

      {!isCentrifuge && <TopBeneficiariesTable />}
    </Wrapper>
  );
}
