import { useEffect } from "react";
import {
  estimateBlocksTime,
  getApi,
} from "../../../site/src/services/chainApi";
import { useState } from "react";

export function useSpendPeriod(chain) {
  const [spendPeriod, setSpendPeriod] = useState({});

  useEffect(() => {
    fetchSpendPeriod();

    async function fetchSpendPeriod() {
      const api = await getApi(chain);
      const bestNumber = await api.derive.chain.bestNumber();
      const spendPeriod = api.consts.treasury.spendPeriod;
      const goneBlocks = bestNumber.mod(spendPeriod);

      setSpendPeriod({
        blockNumber: spendPeriod.toNumber(),
        periodTime: await estimateBlocksTime(chain, spendPeriod),
        restBlocks: spendPeriod.sub(goneBlocks).toNumber(),
        restTime: await estimateBlocksTime(chain, spendPeriod.sub(goneBlocks)),
        progress: goneBlocks.muln(100).div(spendPeriod).toNumber(),
      });
    }
  }, [chain]);

  return spendPeriod;
}
