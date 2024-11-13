import { isPolkadot } from "../../utils/chains";
import { useAssetHubAsset } from "../assetHub/useAssetHubAsset";
import { STATEMINT_FELLOWSHIP_SALARY_ACCOUNT } from "../../constants/statemint";

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

export default function useQueryFellowshipSalaryBalance(symbol) {
  let salaryAccount = null;

  if (isPolkadot) {
    salaryAccount = STATEMINT_FELLOWSHIP_SALARY_ACCOUNT;
  }

  const asset = getAssetBySymbol(symbol);
  const [value, loading] = useAssetHubAsset(asset.id, salaryAccount);

  return {
    balance: value,
    isLoading: loading,
  };
}
