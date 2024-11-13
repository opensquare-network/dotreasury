import { isPolkadot } from "../../utils/chains";
import { useAssetHubAsset } from "../assetHub/useAssetHubAsset";

export const StatemintAssets = [
  {
    id: 1984,
    symbol: "USDt",
    decimals: 6,
  },
  {
    id: 1337,
    symbol: "USDC",
    decimals: 6,
  },
];

export const getAssetBySymbol = (symbol) =>
  StatemintAssets.find((asset) => asset.symbol === symbol);

export const StatemintFellowShipSalaryAccount =
  "13w7NdvSR1Af8xsQTArDtZmVvjE8XhWNdL4yed3iFHrUNCnS";

export const StatemintFellowShipTreasuryAccount =
  "16VcQSRcMFy6ZHVjBvosKmo7FKqTb8ZATChDYo8ibutzLnos";

export default function useQueryFellowshipSalaryBalance(symbol) {
  let salaryAccount = null;

  if (isPolkadot) {
    salaryAccount = StatemintFellowShipSalaryAccount;
  }

  const asset = getAssetBySymbol(symbol);
  const [value, loading] = useAssetHubAsset(asset.id, salaryAccount);

  return {
    balance: value,
    isLoading: loading,
  };
}
