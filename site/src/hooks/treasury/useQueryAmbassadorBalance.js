import { isPolkadot } from "../../utils/chains";
import { useAssetHubAsset } from "../assetHub/useAssetHubAsset";
import { STATEMINT_AMBASSADOR_TREASURY_ACCOUNT } from "../../constants/statemint";
import { getAssetBySymbol } from "../../utils";

export default function useQueryAmbassadorBalance(symbol) {
  let salaryAccount = null;

  if (isPolkadot) {
    salaryAccount = STATEMINT_AMBASSADOR_TREASURY_ACCOUNT;
  }

  const asset = getAssetBySymbol(symbol);
  const [value, loading] = useAssetHubAsset(asset.id, salaryAccount);

  return {
    balance: value,
    isLoading: loading,
  };
}
