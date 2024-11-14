import useAssetHubApi from "../assetHub/useAssetHubApi";
import { useEffect, useState } from "react";

export function useQueryAccountFree(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    api?.query.system.account?.(address).then((accountData) => {
      setBalance(accountData?.data?.free?.toJSON() || 0);
      setIsLoading(false);
    });
  }, [api, address]);

  return {
    balance,
    isLoading,
  };
}

export function useQueryAssetHubTreasuryFree(address) {
  const api = useAssetHubApi();
  return useQueryAccountFree(api, address);
}
