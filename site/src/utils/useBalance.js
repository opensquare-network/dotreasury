import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";

export default function useBalance(api, address) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    api.query.system.account(address)
      .then(account => {
        const balance = new BigNumber(account.data.free.toJSON())
          .plus(account.data.reserved.toJSON())
          .toString();
        setBalance(balance);
      }).finally(() => {
        setIsLoading(false);
      });
  }, [api, address]);

  return { balance, isLoading };
}
