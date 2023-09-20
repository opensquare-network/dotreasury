import { useEffect } from "react";
import { connect } from "../services/websocket";
import { createGlobalState } from "react-use";
import { DEFAULT_OVERVIEW_DATA } from "../utils/consts";

const useGlobalScanHeight = createGlobalState({
  polkadot: 0,
  kusama: 0,
});
const useGlobalOverviewData = createGlobalState({
  polkadot: DEFAULT_OVERVIEW_DATA,
  kusama: DEFAULT_OVERVIEW_DATA,
});

export function useConnectSocket(chain) {
  const [, setGlobalHeight] = useGlobalScanHeight();
  const [, setGlobalOverviewData] = useGlobalOverviewData();

  useEffect(() => {
    connect(chain, {
      setHeight: (height) => {
        setGlobalHeight((value) => ({ ...value, [chain]: height }));
      },
      setOverviewData: (overviewData) => {
        setGlobalOverviewData((value) => ({ ...value, [chain]: overviewData }));
      },
    });
  }, []);
}

export function useScanHeight(chain) {
  const [height] = useGlobalScanHeight();
  return height[chain];
}

export function useOverviewData(chain) {
  const [overviewData] = useGlobalOverviewData();
  return overviewData[chain];
}
