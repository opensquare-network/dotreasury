import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PolarAreaChart from "../../components/CustomPolarArea";
import {
  OVERVIEW_BIG_SPENDER_COLOR,
  OVERVIEW_BIG_TIPPER_COLOR,
  OVERVIEW_MEDIUM_SPENDER_COLOR,
  OVERVIEW_SMALL_SPENDER_COLOR,
  OVERVIEW_SMALL_TIPPER_COLOR,
  OVERVIEW_TREASURER_COLOR,
} from "../../constants";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import { abbreviateBigNumber, getPrecision, toPrecision } from "../../utils";
import { sum } from "../../utils/math";
import OverviewBaseChartCard from "./ChartCard";

export default function OpenGovSpend() {
  const overview = useSelector(overviewSelector);
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);
  const {
    treasurer,
    small_tipper,
    big_tipper,
    small_spender,
    medium_spender,
    big_spender,
  } = overview.output?.referendaSpent ?? {};

  const chartData = useMemo(() => {
    return {
      icon: "circle",
      labels: [
        {
          name: "Treasurer",
          value: toPrecision(treasurer?.value ?? 0, precision, false),
          fiatValue: treasurer?.fiatValue ?? 0,
          count: treasurer?.count,
          color: OVERVIEW_TREASURER_COLOR,
        },
        {
          name: "Small Tipper",
          value: toPrecision(small_tipper?.value ?? 0, precision, false),
          fiatValue: small_tipper?.fiatValue ?? 0,
          count: small_tipper?.count,
          color: OVERVIEW_SMALL_TIPPER_COLOR,
        },
        {
          name: "Big Tipper",
          value: toPrecision(big_tipper?.value ?? 0, precision, false),
          fiatValue: big_tipper?.fiatValue ?? 0,
          count: big_tipper?.count,
          color: OVERVIEW_BIG_TIPPER_COLOR,
        },
        {
          name: "Small Spender",
          value: toPrecision(small_spender?.value ?? 0, precision, false),
          fiatValue: small_spender?.fiatValue ?? 0,
          count: small_spender?.count,
          color: OVERVIEW_SMALL_SPENDER_COLOR,
        },
        {
          name: "Medium Spender",
          value: toPrecision(medium_spender?.value ?? 0, precision, false),
          fiatValue: medium_spender?.fiatValue ?? 0,
          count: medium_spender?.count,
          color: OVERVIEW_MEDIUM_SPENDER_COLOR,
        },
        {
          name: "Big Spender",
          value: toPrecision(big_spender?.value ?? 0, precision, false),
          fiatValue: big_spender?.fiatValue ?? 0,
          count: big_spender?.count,
          color: OVERVIEW_BIG_SPENDER_COLOR,
        },
      ],
    };
  }, [
    treasurer,
    small_tipper,
    big_tipper,
    small_spender,
    medium_spender,
    big_spender,
    precision,
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
      chart={
        <PolarAreaChart
          data={chartData}
          status={chartStatus}
          tooltipLabelCallback={(tooltipItem) => {
            const { dataset, raw: currentValue } = tooltipItem;
            const total = sum(dataset.data);
            const percentage = parseFloat(
              ((currentValue / total) * 100).toFixed(2)
            );

            return ` ${
              Math.round(currentValue) === currentValue ? "" : "≈"
            }${Math.round(
              currentValue
            ).toLocaleString()} ${symbol} ${percentage}%`;
          }}
        />
      }
    />
  );
}
