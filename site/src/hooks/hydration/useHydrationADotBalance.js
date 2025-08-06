import { useCallback, useEffect, useState, useMemo } from "react";
import useHydrationApi from "./useHydrationApi";

const ADOT_TOKEN_ID = 1001;
const CURRENCIES_API_METHOD = "CurrenciesApi_account";
const RUNTIME_API_TYPE = "PalletCurrenciesRpcRuntimeApiAccountData";

export default function useHydrationADotBalance(address) {
  const api = useHydrationApi();
  const [value, setValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const callParams = useMemo(() => {
    if (!api?.registry || !address) {
      return null;
    }

    try {
      const assetId = api.registry.createType("u32", ADOT_TOKEN_ID);
      const accountId = api.registry.createType("AccountId", address);

      return new Uint8Array([...assetId.toU8a(), ...accountId.toU8a()]);
    } catch (error) {
      console.error("Error creating call parameters:", error);
      return null;
    }
  }, [api, address]);

  const fetchADotBalance = useCallback(async () => {
    if (!api?.rpc?.state || !address || !callParams) {
      return null;
    }

    try {
      setIsLoading(true);
      const resultRaw = await api.rpc.state.call(
        CURRENCIES_API_METHOD,
        Array.from(callParams),
      );

      const accountData = api.registry.createType(RUNTIME_API_TYPE, resultRaw);
      setValue(accountData);
    } catch (error) {
      console.error("Error fetching aDot value:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api, address, callParams]);

  useEffect(() => {
    fetchADotBalance();
  }, [fetchADotBalance]);

  return {
    value,
    isLoading,
  };
}
