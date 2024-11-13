// site/src/pages/Overview/AssetHub.jsx

import styled from "styled-components";
import Card from "../../../../components/Card";
import TreasuryDetailHydration from "./hydration";
import { grid, grid_cols } from "../../../../styles/tailwindcss";
import TreasuryDetailBounties from "./bounties";

const Wrapper = styled(Card)`
  padding: 24px;
  ${grid}
  ${grid_cols(3)}
  gap: 48px;
`;

export default function OverviewTreasuryDetail() {
  return (
    <Wrapper>
      <TreasuryDetailHydration />
      <TreasuryDetailBounties />
    </Wrapper>
  );
}
