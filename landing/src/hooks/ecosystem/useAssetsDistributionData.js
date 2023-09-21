import { useState } from "react";
import { useTheme } from "../../../../site/src/context/theme";
import { toPrecision } from "../../../../site/src/utils";
import { useEffect } from "react";
import { CHAINS, getChainSettings } from "../../utils/chains";
import { createChartStatusToggleClickEvent } from "../../utils/chart/statusToggleClickEvent";
import { useTreasuriesData } from "../useTreasuriesData";
import sumBy from "lodash.sumby";

export function useEcosystemAssetsDistributionData() {
  const theme = useTheme();
  const { data: treasuriesData } = useTreasuriesData();

  const COLORS = {
    [CHAINS.polkadot.name]: theme.pink500,
    [CHAINS.kusama.name]: theme.pink300,
    [CHAINS.basilisk.name]: theme.purple300,
    [CHAINS.centrifuge.name]: theme.orange300,
    [CHAINS.hydradx.name]: theme.purple500,
    [CHAINS.interlay.name]: theme.yellow300,
    [CHAINS.phala.name]: theme.yellow500,
    [CHAINS.kintsugi.name]: theme.orange500,
    other: theme.neutral500,
  };

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
    "value",
  );

  useEffect(() => {
    setData({
      icon: "circle",
      labels: treasuriesData.map((treasury) => {
        const chainSettings = getChainSettings(treasury.chain);
        const value = toPrecision(
          treasury.value,
          chainSettings.decimals,
          false,
        );

        return {
          name: chainSettings.name,
          value,
          color: COLORS[chainSettings.name] || COLORS.other,
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
  }, [theme, treasuriesData]);

  const clickEvent = createChartStatusToggleClickEvent(status, setStatus);

  return {
    data,
    status,
    total,
    clickEvent,
  };
}
