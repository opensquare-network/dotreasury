import { useMemo, useState } from "react";
import PolarAreaChart from "../../components/CustomPolarArea";
import {
  OVERVIEW_BIG_SPENDER_COLOR,
  OVERVIEW_BIG_TIPPER_COLOR,
  OVERVIEW_MEDIUM_SPENDER_COLOR,
  OVERVIEW_SMALL_SPENDER_COLOR,
  OVERVIEW_SMALL_TIPPER_COLOR,
  OVERVIEW_TREASURER_COLOR,
} from "../../constants";
import OverviewBaseChartCard from "./ChartCard";

export default function OpenGovSpend({
  treasurer,
  smallTipper,
  bigTipper,
  smallSpender,
  mediumSpender,
  bigSpender,
} = {}) {
  const chartData = useMemo(() => {
    return {
      icon: "circle",
      labels: [
        {
          name: "Treasurer",
          value: treasurer,
          color: OVERVIEW_TREASURER_COLOR,
        },
        {
          name: "Small Tipper",
          value: smallTipper,
          color: OVERVIEW_SMALL_TIPPER_COLOR,
        },
        {
          name: "Big Tipper",
          value: bigTipper,
          color: OVERVIEW_BIG_TIPPER_COLOR,
        },
        {
          name: "Small Spender",
          value: smallSpender,
          color: OVERVIEW_SMALL_SPENDER_COLOR,
        },
        {
          name: "Medium Spender",
          value: mediumSpender,
          color: OVERVIEW_MEDIUM_SPENDER_COLOR,
        },
        {
          name: "Big Spender",
          value: bigSpender,
          color: OVERVIEW_BIG_SPENDER_COLOR,
        },
      ],
    };
  }, [
    treasurer,
    smallTipper,
    bigTipper,
    smallSpender,
    mediumSpender,
    bigSpender,
  ]);

  const [chartStatus, setChartStatus] = useState({
    labels: chartData.labels.map((item) => ({
      name: item.name,
      disabled: false,
    })),
  });

  function clickEvent(name) {
    const obj = Object.assign({}, chartStatus);
    obj.labels.forEach((item) => {
      if (item.name === name) {
        const disabled = !item.disabled;
        item.disabled = disabled;
      }
    });
    setChartStatus(obj);
  }

  return (
    <OverviewBaseChartCard
      title="OpenGov Spend"
      data={chartData}
      status={chartStatus}
      clickEvent={clickEvent}
      chart={<PolarAreaChart data={chartData} status={chartStatus} />}
    />
  );
}
