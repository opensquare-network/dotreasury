import React from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import ReactDOMServer from "react-dom/server";
import MyTooltip from "./MyTooltip";
import { useState } from "react";
import { useCallback } from "react";
import { abbreviateBigNumber } from "../../../utils";
import { useTheme } from "../../../context/theme";
import merge from "lodash.merge";
import {
  useIncomePeriodsChartDatasets,
  useOutputPeriodsChartDatasets,
  usePeriodsChartLabels,
  usePeriodsDatasetsMaxValue,
} from "../../../hooks/overview/usePeriodsChart";

const ScrollableWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-grow: 1;
  overflow-x: auto;
`;

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  min-width: ${(p) => p.minWidth}px;
`;

const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "var(--tooltipBg)";
    tooltipEl.style.borderRadius = "3px";
    tooltipEl.style.color = "white";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";

    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler =
  (symbol, scrollLeft, groupSeparateLabels = []) =>
  (context) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set tooltip content
    if (tooltip.body) {
      const htmlString = ReactDOMServer.renderToString(
        <MyTooltip
          tooltip={tooltip}
          symbol={symbol}
          groupSeparateLabels={groupSeparateLabels}
        />,
      );
      tooltipEl.innerHTML = htmlString;
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX - scrollLeft + tooltip.caretX + "px";
    tooltipEl.style.top = positionY + tooltip.y + "px";
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding =
      tooltip.options.padding + "px " + tooltip.options.padding + "px";
  };

export default function IncomeAndOutputPeriodsChart({
  incomePeriodsLegends = [],
  incomePeriodsData = [],
  outputPeriodsLegends = [],
  outputPeriodsData = [],
  options = {},
  plugins = [],
  extraDatasets = [],
}) {
  const theme = useTheme();
  const symbol = useSelector(chainSymbolSelector);

  const [scrollLeft, setScrollLeft] = useState(0);
  const onScroll = useCallback((e) => {
    setScrollLeft(e.target.scrollLeft);
  }, []);

  const minWidth =
    (incomePeriodsData.length || outputPeriodsData.length || 0) * 10;

  const labels = usePeriodsChartLabels();
  const incomePeriodsDatasets =
    useIncomePeriodsChartDatasets(incomePeriodsLegends);

  const outputPeriodsDatasets =
    useOutputPeriodsChartDatasets(outputPeriodsLegends);

  const max = usePeriodsDatasetsMaxValue(
    ...incomePeriodsDatasets,
    ...outputPeriodsDatasets,
  );

  const datasets = [...outputPeriodsDatasets, ...incomePeriodsDatasets];

  return (
    <ScrollableWrapper onScroll={onScroll}>
      <Wrapper minWidth={minWidth}>
        <Bar
          data={{
            labels,
            datasets: [...datasets, ...extraDatasets],
          }}
          options={merge(
            {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: "index",
              },
              animation: {
                duration: 0,
              },
              scales: {
                x: {
                  stacked: true,
                  ticks: {
                    display: false,
                  },
                  border: {
                    display: false,
                  },
                  grid: {
                    display: false,
                  },
                },
                y: {
                  position: "right",
                  stacked: true,
                  suggestedMin: -max,
                  suggestedMax: max,
                  ticks: {
                    display: !!minWidth,
                    callback(value) {
                      value = Math.abs(value);
                      value = value + (value ? 1 : 0) || 0;
                      return abbreviateBigNumber(value);
                    },
                  },
                  border: {
                    display: false,
                  },
                  grid: {
                    display: !!minWidth,
                    color() {
                      return theme.neutral300;
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: false,
                  position: "nearest",
                  external: externalTooltipHandler(symbol, scrollLeft, [
                    incomePeriodsDatasets?.[0]?.label,
                  ]),
                  padding: 8,
                },
              },
            },
            options,
          )}
          plugins={plugins}
        />
      </Wrapper>
    </ScrollableWrapper>
  );
}
