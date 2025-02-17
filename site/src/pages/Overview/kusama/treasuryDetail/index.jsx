import styled from "styled-components";
import { grid, grid_cols } from "../../../../styles/tailwindcss";
import { mdcss, smcss } from "../../../../styles/responsive";
import TreasuryDetailOnRelayChain from "./relayChain";
import TreasuryDetailOnAssetHub from "./assetHub";
// import TreasuryDetailLoans from "./loans";

const Wrapper = styled.div`
  ${grid}
  ${grid_cols(4)}
  gap: 48px;
  ${mdcss(grid_cols(2))}
`;

export default function OverviewTreasuryDetail() {
  return (
    <Wrapper>
      <TreasuryDetailOnRelayChain />
      <TreasuryDetailOnAssetHub />
      {/* <TreasuryDetailLoans /> */}
    </Wrapper>
  );
}
