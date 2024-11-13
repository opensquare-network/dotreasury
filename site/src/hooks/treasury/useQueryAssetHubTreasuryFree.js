import useAssetHubApi from "../assetHub/useAssetHubApi";
import useCall from "../useCall";

export function useQueryAccountFree(api, address) {
  const { loaded, value } = useCall(api?.query.system?.account, [address]);

  return {
    balance: value?.data?.free?.toJSON() || 0,
    isLoading: !loaded,
  };
}

export function useQueryAssetHubTreasuryFree(address) {
  const api = useAssetHubApi();
  return useQueryAccountFree(api, address);
}
