import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";
import {
  polkadotTreasurySpendsAssetsFilterOptions,
  kusamaTreasurySpendsAssetsFilterOptions,
} from "../constants";

export function useTreasurySpendAssetsFilterOptions() {
  const chain = useSelector(chainSelector);
  return chain === "polkadot"
    ? polkadotTreasurySpendsAssetsFilterOptions
    : kusamaTreasurySpendsAssetsFilterOptions;
}
