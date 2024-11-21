import { isPolkadot } from "../../utils/chains";
import { useAssetHubAsset } from "../assetHub/useAssetHubAsset";
import { STATEMINT_FELLOWSHIP_SALARY_ACCOUNT } from "../../constants/statemint";
import { getAssetBySymbol } from "../../utils";

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
