import { useState } from "react";
import useApi from "../useApi";
import { useCallback } from "react";
import BigNumber from "bignumber.js";
import { querySystemAccountBalance } from "../../utils/useBalance";
import { useEffect } from "react";
import scanApi from "../../services/scanApi";

export function useBountiesTotalBalance(bounties) {
  const api = useApi();

  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchBalances = useCallback(async () => {
    try {
      const balances = await Promise.all(
        bounties.map(async (bounty) => {
          const id = bounty?.index?.toJSON();
          if (!id) return new BigNumber(0);

          try {
            const response = await scanApi.fetch(`bounties/${id}`);
            const { address, value = 0 } = response?.result || {};

            if (!address) {
              return new BigNumber(value);
            }

            return await querySystemAccountBalance(api, address);
          } catch (error) {
            throw new Error(
              `Error fetching balance for bounty index ${id}: ${error}`,
            );
          }
        }),
      );

      const total = BigNumber.sum(...balances).toString();
      setTotalBalance(total);
    } catch (error) {
      throw new Error(`"Error fetching balances: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [bounties, api]);

  useEffect(() => {
    if (!api || !bounties || bounties?.length === 0) {
      return;
    }

    fetchBalances();
  }, [fetchBalances, api, bounties]);

  return {
    balance: totalBalance,
    isLoading,
  };
}
