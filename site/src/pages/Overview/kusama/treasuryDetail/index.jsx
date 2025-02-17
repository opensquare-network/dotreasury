import styled from "styled-components";
import Card from "../../../../components/Card";
import { grid, grid_cols } from "../../../../styles/tailwindcss";
import { mdcss, smcss } from "../../../../styles/responsive";
import TreasuryDetailOnRelayChain from "./relayChain";
// import TreasuryDetailOnAssetHub from "./assetHub";
// import TreasuryDetailLoans from "./loans";

const Wrapper = styled(Card)`
  padding: 24px;
  ${grid}
  ${grid_cols(4)}
  gap: 48px;
  ${mdcss(grid_cols(2))}
  ${smcss(grid_cols(1))}
`;

export default function OverviewTreasuryDetail() {
  return (
    <Wrapper>
      <TreasuryDetailOnRelayChain />
      {/* <TreasuryDetailOnAssetHub /> */}
      {/* <TreasuryDetailLoans /> */}
    </Wrapper>
  );
}
