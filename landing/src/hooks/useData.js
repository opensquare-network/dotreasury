import { useEffect } from "react";
import { connect } from "../services/websocket";
import { createGlobalState } from "react-use";
import { DEFAULT_OVERVIEW_DATA } from "../utils/consts";
import {
  estimateBlocksTime,
  getApi,
} from "../../../site/src/services/chainApi";
import { TreasuryAccount } from "../../../site/src/constants";
import { getChainSettings } from "../utils/chains";
import { toPrecision } from "../../../site/src/utils";
import scanApi from "../../../site/src/services/scanApi";

const useGlobalScanHeight = createGlobalState({
  polkadot: 0,
  kusama: 0,
});
const useGlobalOverviewData = createGlobalState({
  polkadot: DEFAULT_OVERVIEW_DATA,
  kusama: DEFAULT_OVERVIEW_DATA,
});
const useGlobalSpendPeriodData = createGlobalState({
  polkadot: {},
  kusama: {},
});
const useGlobalTreasuryData = createGlobalState({
  polkadot: {},
  kusama: {},
});
const useGlobalStatsHistory = createGlobalState({
  polkadot: [],
  kusama: [],
});

export function usePrepareSiteData(chain) {
  const [, setGlobalHeight] = useGlobalScanHeight();
  const [, setGlobalOverviewData] = useGlobalOverviewData();
  const [, setGlobalTreasuryData] = useGlobalTreasuryData();
  const [, setGlobalSpendPeriod] = useGlobalSpendPeriodData();
  const [, setGlobalStatsHistory] = useGlobalStatsHistory();

  const { decimals } = getChainSettings(chain);

  useEffect(() => {
    connect(chain, {
      setHeight: (height) => {
        setGlobalHeight((value) => ({ ...value, [chain]: height }));
      },
      setOverviewData: (overviewData) => {
        setGlobalOverviewData((value) => ({ ...value, [chain]: overviewData }));
      },
    });

    fetchTreasuryData();
    async function fetchTreasuryData() {
      const api = await getApi(chain);

      const account = (
        await api.query.system.account(TreasuryAccount)
      ).toJSON();

      const result = {
        free: account ? toPrecision(account.data.free, decimals, false) : 0,
        burnPercent: toPrecision(api.consts.treasury.burn, 6, false),
      };

      setGlobalTreasuryData((value) => ({
        ...value,
        [chain]: result,
      }));
    }

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

      setGlobalSpendPeriod((value) => ({
        ...value,
        [chain]: data,
      }));
    }

    scanApi.fetch(`/${chain}/stats/weekly`).then(({ result }) => {
      if (result) {
        setGlobalStatsHistory((value) => ({ ...value, [chain]: result }));
      }
    });
  }, [
    chain,
    decimals,
    setGlobalHeight,
    setGlobalOverviewData,
    setGlobalTreasuryData,
    setGlobalSpendPeriod,
    setGlobalStatsHistory,
  ]);
}

export function useScanHeight(chain) {
  const [height] = useGlobalScanHeight();
  return height[chain];
}

export function useOverviewData(chain) {
  const [overviewData] = useGlobalOverviewData();
  return overviewData[chain];
}

export function useTreasuryData(chain) {
  const [treasuryData] = useGlobalTreasuryData();
  return treasuryData[chain];
}

export function useSpendPeriodData(chain) {
  const [spendPeriodData] = useGlobalSpendPeriodData();
  return spendPeriodData[chain];
}

export function useStatsHistory(chain) {
  const [statsHistory] = useGlobalStatsHistory();
  return statsHistory[chain];
}
