import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import PolarAreaChart from "../../components/CustomPolarArea";

import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import { getPrecision, toPrecision } from "../../utils";
import { sumBy } from "../../utils/math";
import OverviewBaseChartCard from "./ChartCard";
import { useTheme } from "../../context/theme";
import OpengovSpendTitle from "./OpengovSpendTitle";

export default function OpenGovSpend() {
  const theme = useTheme();
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
    false,
  );
  const smallTipperFiatValue = small_tipper?.fiatValue ?? 0;
  const bigTipperValue = toPrecision(big_tipper?.value ?? 0, precision, false);
  const bigTipperFiatValue = big_tipper?.fiatValue ?? 0;
  const smallSpendValue = toPrecision(
    small_spender?.value ?? 0,
    precision,
    false,
  );
  const smallSpendFiatValue = small_spender?.fiatValue ?? 0;
  const mediumSpendValue = toPrecision(
    medium_spender?.value ?? 0,
    precision,
    false,
  );
  const mediumSpendFiatValue = medium_spender?.fiatValue ?? 0;
  const bigSpendValue = toPrecision(big_spender?.value ?? 0, precision, false);
  const bigSpendFiatValue = big_spender?.fiatValue ?? 0;

  const data = useMemo(
    () => ({
      icon: "circle",
      labels: [
        {
          name: "Treasurer",
          value: treasurerValue,
          fiatValue: treasurerFiatValue,
          count: treasurer?.count,
          color: theme.pink500,
          disabled: false,
        },
        {
          name: "Small Tipper",
          value: smallTipperValue,
          fiatValue: smallTipperFiatValue,
          count: small_tipper?.count,
          color: theme.yellow300,
          disabled: false,
        },
        {
          name: "Big Tipper",
          value: bigTipperValue,
          fiatValue: bigTipperFiatValue,
          count: big_tipper?.count,
          color: theme.yellow500,
          disabled: false,
        },
        {
          name: "Small Spender",
          value: smallSpendValue,
          fiatValue: smallSpendFiatValue,
          count: small_spender?.count,
          color: theme.orange100,
          disabled: false,
        },
        {
          name: "Medium Spender",
          value: mediumSpendValue,
          fiatValue: mediumSpendFiatValue,
          count: medium_spender?.count,
          color: theme.orange300,
          disabled: false,
        },
        {
          name: "Big Spender",
          value: bigSpendValue,
          fiatValue: bigSpendFiatValue,
          count: big_spender?.count,
          color: theme.orange500,
          disabled: false,
        },
      ].sort((a, b) => b.value - a.value),
    }),
    [
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
      theme,
    ],
  );

  const [chartData, setChartData] = useState(data);
  useEffect(() => setChartData(data), [data]);

  const totalEnabledValue = sumBy(
    chartData.labels.filter((i) => !i.disabled),
    "value",
  );
  const totalEnabledFiatValue = sumBy(
    chartData.labels.filter((i) => !i.disabled),
    "fiatValue",
  );

  function clickEvent(name) {
    const obj = Object.assign({}, chartData);
    obj.labels.forEach((item) => {
      if (item.name === name) {
        const disabled = !item.disabled;
        item.disabled = disabled;
      }
    });
    setChartData(obj);
  }

  return (
    <OverviewBaseChartCard
      title={<OpengovSpendTitle>OpenGov Spent</OpengovSpendTitle>}
      data={chartData}
      status={chartData}
      clickEvent={clickEvent}
      chart={
        <PolarAreaChart
          data={chartData}
          status={chartData}
          tooltipLabelCallback={(tooltipItem) => {
            const { raw: currentValue, label } = tooltipItem;
            const currentFiatValue = chartData.labels.find(
              (i) => i.name === label,
            )?.fiatValue;
            const valuePercentage = parseFloat(
              ((currentValue / totalEnabledValue) * 100).toFixed(2),
            );
            const fiatValuePercentage = parseFloat(
              ((currentFiatValue / totalEnabledFiatValue || 0) * 100).toFixed(
                2,
              ),
            );

            const token = ` ${
              Math.round(currentValue) === currentValue ? "" : "≈ "
            }${Math.round(
              currentValue,
            ).toLocaleString()} ${symbol} ${valuePercentage}%`;
            const fiat = ` ≈ $${Math.round(
              currentFiatValue,
            ).toLocaleString()} ${fiatValuePercentage}%`;

            return [token, fiat];
          }}
        />
      }
    />
  );
}
