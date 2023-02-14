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
import { getPrecision, toPrecision } from "../../utils";
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

  const treasurerValue = toPrecision(treasurer?.value ?? 0, precision, false);
  const treasurerFiatValue = treasurer?.fiatValue ?? 0;
  const smallTipperValue = toPrecision(
    small_tipper?.value ?? 0,
    precision,
    false
  );
  const smallTipperFiatValue = small_tipper?.fiatValue ?? 0;
  const bigTipperValue = toPrecision(big_tipper?.value ?? 0, precision, false);
  const bigTipperFiatValue = big_tipper?.fiatValue ?? 0;
  const smallSpendValue = toPrecision(
    small_spender?.value ?? 0,
    precision,
    false
  );
  const smallSpendFiatValue = small_spender?.fiatValue ?? 0;
  const mediumSpendValue = toPrecision(
    medium_spender?.value ?? 0,
    precision,
    false
  );
  const mediumSpendFiatValue = medium_spender?.fiatValue ?? 0;
  const bigSpendValue = toPrecision(big_spender?.value ?? 0, precision, false);
  const bigSpendFiatValue = big_spender?.fiatValue ?? 0;

  const valueArray = [
    treasurerValue,
    smallTipperValue,
    bigTipperValue,
    smallSpendValue,
    mediumSpendValue,
    bigSpendValue,
  ];
  const fiatValueArray = [
    treasurerFiatValue,
    smallTipperFiatValue,
    bigTipperFiatValue,
    smallSpendFiatValue,
    mediumSpendFiatValue,
    bigSpendFiatValue,
  ];

  const totalValue = sum(valueArray);
  const totalFiatValue = sum(fiatValueArray);

  const chartData = useMemo(() => {
    return {
      icon: "circle",
      labels: [
        {
          name: "Treasurer",
          value: treasurerValue,
          fiatValue: treasurerFiatValue,
          count: treasurer?.count,
          color: OVERVIEW_TREASURER_COLOR,
        },
        {
          name: "Small Tipper",
          value: smallTipperValue,
          fiatValue: smallTipperFiatValue,
          count: small_tipper?.count,
          color: OVERVIEW_SMALL_TIPPER_COLOR,
        },
        {
          name: "Big Tipper",
          value: bigTipperValue,
          fiatValue: bigTipperFiatValue,
          count: big_tipper?.count,
          color: OVERVIEW_BIG_TIPPER_COLOR,
        },
        {
          name: "Small Spender",
          value: smallSpendValue,
          fiatValue: smallSpendFiatValue,
          count: small_spender?.count,
          color: OVERVIEW_SMALL_SPENDER_COLOR,
        },
        {
          name: "Medium Spender",
          value: mediumSpendValue,
          fiatValue: mediumSpendFiatValue,
          count: medium_spender?.count,
          color: OVERVIEW_MEDIUM_SPENDER_COLOR,
        },
        {
          name: "Big Spender",
          value: bigSpendValue,
          fiatValue: bigSpendFiatValue,
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
    treasurerValue,
    smallTipperValue,
    bigTipperValue,
    smallSpendValue,
    mediumSpendValue,
    bigSpendValue,
    treasurerFiatValue,
    smallTipperFiatValue,
    bigTipperFiatValue,
    smallSpendFiatValue,
    mediumSpendFiatValue,
    bigSpendFiatValue,
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
            const { raw: currentValue, label } = tooltipItem;
            const currentFiatValue = chartData.labels.find(
              (i) => i.name === label
            )?.fiatValue;
            const valuePercentage = parseFloat(
              ((currentValue / totalValue) * 100).toFixed(2)
            );
            const fiatValuePercentage = parseFloat(
              ((currentFiatValue / totalFiatValue) * 100).toFixed(2)
            );

            const token = `${
              Math.round(currentValue) === currentValue ? "" : "≈"
            }${Math.round(
              currentValue
            ).toLocaleString()} ${symbol} ${valuePercentage}%`;
            const fiat = `${
              Math.round(currentFiatValue) === currentFiatValue ? "" : "≈"
            }$${Math.round(
              currentFiatValue
            ).toLocaleString()} ${fiatValuePercentage}%`;

            return `${token}  ${fiat}`;
          }}
        />
      }
    />
  );
}
