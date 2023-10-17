import React from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import dayjs from "dayjs";
import ReactDOMServer from "react-dom/server";
import MyTooltip from "./MyTooltip";
import { useState } from "react";
import { useCallback } from "react";
import { abbreviateBigNumber } from "../../../utils";
import flatten from "lodash.flatten";
import { useTheme } from "../../../context/theme";
import merge from "lodash.merge";

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
}) {
  const theme = useTheme();
  const symbol = useSelector(chainSymbolSelector);

  const [scrollLeft, setScrollLeft] = useState(0);
  const onScroll = useCallback((e) => {
    setScrollLeft(e.target.scrollLeft);
  }, []);

  const categoryPercentage = 0.7;
  const barPercentage = 0.8;

  const minWidth =
    (incomePeriodsData.length || outputPeriodsData.length || 0) * 10;

  const labels = outputPeriodsData.map(
    (item) =>
      `${dayjs(item.startIndexer.blockTime).format("YYYY-MM-DD")} ~ ${dayjs(
        item.endIndexer.blockTime,
      ).format("YYYY-MM-DD")}`,
  );
  const incomePeriodsDatasets = incomePeriodsLegends.map((legend) => {
    return {
      categoryPercentage,
      barPercentage,
      label: legend.label,
      data: incomePeriodsData.map(legend.getValue),
      backgroundColor: legend.color,
      stack: "period",
    };
  });
  const spendPeriodsDatasets = outputPeriodsLegends.map((legend) => {
    return {
      categoryPercentage,
      barPercentage,
      label: legend.label,
      data: outputPeriodsData.map(legend.getValue),
      counts: outputPeriodsData.map(legend.getCount),
      fiats: outputPeriodsData.map(legend.getFiat),
      backgroundColor: legend.color,
      stack: "period",
    };
  });

  const incomeValues = flatten(incomePeriodsDatasets.map((i) => i.data));
  const spendValues = flatten(spendPeriodsDatasets.map((i) => i.data));
  const max = Math.max(...[...incomeValues, ...spendValues].map(Math.abs));

  const datasets = [...spendPeriodsDatasets, ...incomePeriodsDatasets];

  return (
    <ScrollableWrapper onScroll={onScroll}>
      <Wrapper minWidth={minWidth}>
        <Bar
          data={{
            labels,
            datasets,
          }}
          options={merge(
            {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: "index",
                intersect: false,
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
                      return abbreviateBigNumber(Math.abs(value));
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
        />
      </Wrapper>
    </ScrollableWrapper>
  );
}
