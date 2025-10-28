import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { grid, grid_cols } from "../../../../styles/tailwindcss";
import { mdcss } from "../../../../styles/responsive";
// import TreasuryDetailOnRelayChain from "./relayChain";
import TreasuryDetailOnAssetHub from "./assetHub";
import TreasuryDetailLoans from "./loans";
import { SpendPeriodItem, ToBeAwardedItem, BurntItem } from "../../Summary";
import {
  fetchTreasury,
  treasurySelector,
} from "../../../../store/reducers/burntSlice";
import { useEffect } from "react";

const Wrapper = styled.div`
  ${grid}
  ${grid_cols(4)}
  gap: 16px 64px;
  ${mdcss(grid_cols(2))}
`;

export default function OverviewTreasuryDetail() {
  const dispatch = useDispatch();
  const treasury = useSelector(treasurySelector);

  useEffect(() => {
    dispatch(fetchTreasury());
  }, [dispatch]);

  return (
    <Wrapper>
      {/* <TreasuryDetailOnRelayChain /> */}
      <TreasuryDetailOnAssetHub />
      <TreasuryDetailLoans />
      <SpendPeriodItem />
      <ToBeAwardedItem />
      <BurntItem treasury={treasury} />
    </Wrapper>
  );
}
