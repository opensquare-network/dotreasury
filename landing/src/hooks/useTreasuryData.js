import { useEffect } from "react";
import { getApi } from "../../../site/src/services/chainApi";
import { useState } from "react";
import { TreasuryAccount } from "../../../site/src/constants";
import { getPrecision, toPrecision } from "../../../site/src/utils";
import { getChainSettings } from "../utils/chains";

export function useTreasuryData(chain) {
  const { symbol } = getChainSettings(chain);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchTreasuryData();

    async function fetchTreasuryData() {
      const api = await getApi(chain);

      const account = (
        await api.query.system.account(TreasuryAccount)
      ).toJSON();

      const result = {
        free: account
          ? toPrecision(account.data.free, getPrecision(symbol), false)
          : 0,
        burnPercent: toPrecision(api.consts.treasury.burn, 6, false),
      };

      setData(result);
    }
  }, [chain]);

  return data;
}
