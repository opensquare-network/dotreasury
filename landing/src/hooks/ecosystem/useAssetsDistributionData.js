import { useState } from "react";
import { useTheme } from "../../../../site/src/context/theme";
import { BUBBLE_DATA } from "../../fixtures";
import { abbreviateBigNumber, toPrecision } from "../../../../site/src/utils";
import { useEffect } from "react";
import { CHAINS, getChainSettings } from "../../utils/chains";
import { createChartStatusToggleClickEvent } from "../../utils/chart/statusToggleClickEvent";

export function useEcosystemAssetsDistributionData() {
  const theme = useTheme();

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
  const [status, setStatus] = useState({
    labels: BUBBLE_DATA.map((item) => {
      const chainSettings = getChainSettings(item.name);

      return {
        name: chainSettings.name,
      };
    }),
  });

  const findDisabled = (name) => {
    const findFunc = (item) => {
      if (item.name === name) return item.disabled;
      if (item.children) {
        return item.children.find(findFunc);
      }
      return;
    };
    const result = status?.labels?.find(findFunc);
    return result;
  };
  const totalReduce = (acc, current) => {
    if (current.children) {
      if (current.value) return acc + current.value;
      return acc + current.children.reduce(totalReduce, 0);
    }
    return acc + (findDisabled(current.name) ? 0 : current.value ?? 0);
  };
  const total = abbreviateBigNumber(data.labels?.reduce(totalReduce, 0));

  useEffect(() => {
    setData({
      icon: "circle",
      labels: BUBBLE_DATA.map((item) => {
        const chainSettings = getChainSettings(item.name);
        const value = toPrecision(item.value, chainSettings.decimals, false);

        return {
          name: chainSettings.name,
          value,
          color: COLORS[chainSettings.name] || COLORS.other,
        };
      }),
    });
  }, [BUBBLE_DATA, theme]);

  const clickEvent = createChartStatusToggleClickEvent(status, setStatus);

  return {
    data,
    status,
    total,
    clickEvent,
  };
}
