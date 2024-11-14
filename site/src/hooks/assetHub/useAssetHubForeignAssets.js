import { useAsync } from "react-use";
import { useEffect, useState } from "react";
import useAssetHubApi from "./useAssetHubApi";

export default function useAssetHubForeignAssets(
  address,
  paraChainId = 3369,
  parentId = 1,
) {
  const api = useAssetHubApi();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { loading, value } = useAsync(async () => {
    if (!api) {
      return;
    }

    const result = await api?.query?.foreignAssets?.account(
      {
        parents: parentId,
        interior: {
          X1: {
            ParaChain: paraChainId,
          },
        },
      },
      address,
    );

    return result?.toJSON()?.balance || 0;
  }, [api, address, paraChainId, parentId]);

  useEffect(() => {
    if (loading || !value) {
      return;
    }

    setBalance(value);
    setIsLoading(false);
  }, [loading, value]);

  return {
    balance,
    isLoading,
  };
}
