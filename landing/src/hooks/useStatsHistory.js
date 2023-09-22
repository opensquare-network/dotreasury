import { useState } from "react";
import scanApi from "../../../site/src/services/scanApi";
import { useEffect } from "react";

export function useStatsHistory(chain) {
  const [statsHistory, setStatsHistory] = useState([]);

  useEffect(() => {
    scanApi.fetch(`/${chain}/stats/weekly`).then(({ result }) => {
      if (result) {
        setStatsHistory(result);
      }
    });
  }, [chain]);

  return statsHistory;
}
