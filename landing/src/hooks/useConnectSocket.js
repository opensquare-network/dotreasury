import { connect } from "../services/websocket";
import { useOverviewData, useScanHeight } from "./state";

export function useConnectSocket() {
  const [, setHeight] = useScanHeight();
  const [, setOverviewData] = useOverviewData();

  return (chain) => {
    connect(chain, { setHeight, setOverviewData });
  };
}
