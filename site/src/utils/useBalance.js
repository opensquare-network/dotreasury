import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";

export async function querySystemAccountBalance(api, address) {
  const account = await api.query.system.account(address);
  return new BigNumber(account.data.free.toJSON())
    .plus(account.data.reserved.toJSON())
    .toString();
}
export default function useBalance(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    querySystemAccountBalance(api, address)
      .then((account) => {
        const balance = new BigNumber(account.data.free.toJSON())
          .plus(account.data.reserved.toJSON())
          .toString();
        setBalance(balance);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, address]);

  return { balance, isLoading };
}
