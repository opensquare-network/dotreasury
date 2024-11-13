import styled from "styled-components";
import OverviewTreasuryDetail from "./treasuryDetail";
import OverviewTotalTreasury from "./totalTreasury";
import { space_y } from "../../../styles/tailwindcss";

const Wrapper = styled.div`
  ${space_y(16)}
`;

export default function OverviewPolkadot() {
  return (
    <Wrapper>
      <OverviewTotalTreasury />

      <OverviewTreasuryDetail />
    </Wrapper>
  );
}
