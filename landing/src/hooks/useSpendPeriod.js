import { useEffect } from "react";
import {
  estimateBlocksTime,
  getApi,
} from "../../../site/src/services/chainApi";
import { createGlobalState } from "react-use";

const useGlobalSpendPeriod = createGlobalState({
  polkadot: {},
  kusama: {},
});

export function useSpendPeriod(chain) {
  const [spendPeriod, setSpendPeriod] = useGlobalSpendPeriod({});

  useEffect(() => {
    fetchSpendPeriod();

    async function fetchSpendPeriod() {
      const api = await getApi(chain);
      const bestNumber = await api.derive.chain.bestNumber();
      const spendPeriod = api.consts.treasury.spendPeriod;
      const goneBlocks = bestNumber.mod(spendPeriod);

      const data = {
        blockNumber: spendPeriod.toNumber(),
        periodTime: await estimateBlocksTime(chain, spendPeriod),
        restBlocks: spendPeriod.sub(goneBlocks).toNumber(),
        restTime: await estimateBlocksTime(chain, spendPeriod.sub(goneBlocks)),
        progress: goneBlocks.muln(100).div(spendPeriod).toNumber(),
      };

      setSpendPeriod((value) => ({
        ...value,
        [chain]: data,
      }));
    }
  }, [chain]);

  return spendPeriod[chain];
}
