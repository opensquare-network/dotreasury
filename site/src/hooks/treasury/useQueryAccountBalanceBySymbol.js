import { isPolkadot } from "../../utils/chains";
import { useAssetHubAsset } from "../assetHub/useAssetHubAsset";
import { getAssetBySymbol } from "../../utils";

export default function useQueryAccountBalanceBySymbol(symbol, account) {
  let salaryAccount = null;

  if (isPolkadot) {
    salaryAccount = account;
  }

  const asset = getAssetBySymbol(symbol);
  const [value, loading] = useAssetHubAsset(asset.id, salaryAccount);

  return {
    balance: value,
    isLoading: loading,
  };
}
