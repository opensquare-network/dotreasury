import { useMemo, useState } from "react";
import { useTheme } from "@site/src/context/theme";
import { useEffect } from "react";
import { getChainSettings } from "../../utils/chains";
import { createChartStatusToggleClickEvent } from "../../utils/chart/statusToggleClickEvent";
import { useTreasuriesData } from "../useTreasuriesData";
import sumBy from "lodash.sumby";

export function useEcosystemAssetsDistributionData() {
  const theme = useTheme();
  const { data: treasuriesData } = useTreasuriesData();

  const COLORS = useMemo(
    () => [
      theme.pink500,
      theme.pink300,
      theme.yellow500,
      theme.yellow300,
      theme.orange500,
      theme.orange300,
      theme.purple500,
      theme.purple300,
      theme.blue500,
    ],
    [theme],
  );

  const [data, setData] = useState({
    icon: "circle",
    labels: [],
  });
  const [status, setStatus] = useState({ labels: [] });

  const total = sumBy(
    status.labels
      ?.filter((item) => !item.disabled)
      ?.map((item) =>
        treasuriesData.find((predicate) => {
          const chainSettings = getChainSettings(predicate.chain);
          return chainSettings.name === item.name;
        }),
      ),
    "fiatValue",
  );

  useEffect(() => {
    setData({
      icon: "circle",
      labels: treasuriesData.map((treasury, idx) => {
        const chainSettings = getChainSettings(treasury.chain);

        return {
          name: chainSettings.name,
          value: treasury.fiatValue,
          color: COLORS[idx] || theme.neutral500,
        };
      }),
    });

    setStatus({
      labels: treasuriesData.map((treasury) => {
        const chainSettings = getChainSettings(treasury.chain);

        return {
          name: chainSettings.name,
        };
      }),
    });
  }, [theme, treasuriesData, COLORS]);

  const clickEvent = createChartStatusToggleClickEvent(status, setStatus);

  return {
    data,
    status,
    total,
    clickEvent,
  };
}
