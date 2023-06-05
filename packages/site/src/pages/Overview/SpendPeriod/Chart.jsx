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

const ScrollableWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-grow: 1;
  overflow-x: auto;
`;

const Wrapper = styled.div`
  display: flex;
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

const externalTooltipHandler = (symbol, scrollLeft) => (context) => {
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
      <MyTooltip tooltip={tooltip} symbol={symbol} />,
    );
    tooltipEl.innerHTML = htmlString;
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX - scrollLeft + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding =
    tooltip.options.padding + "px " + tooltip.options.padding + "px";
};

export default function Chart({ legends, data = [] }) {
  const symbol = useSelector(chainSymbolSelector);

  const [scrollLeft, setScrollLeft] = useState(0);
  const onScroll = useCallback((e) => {
    setScrollLeft(e.target.scrollLeft);
  }, []);

  const categoryPercentage = 0.7;
  const barPercentage = 0.8;

  const minWidth = (data.length || 0) * 10;

  const labels = data.map(
    (item) =>
      `${dayjs(item.startIndexer.blockTime).format("YYYY-MM-DD")} ~ ${dayjs(
        item.endIndexer.blockTime,
      ).format("YYYY-MM-DD")}`,
  );
  let datasets = legends.map((legend) => {
    return {
      categoryPercentage,
      barPercentage,
      label: legend.label,
      data: data.map(legend.getValue),
      counts: data.map(legend.getCount),
      fiats: data.map(legend.getFiat),
      backgroundColor: legend.color,
      stack: "period",
    };
  });

  return (
    <ScrollableWrapper onScroll={onScroll}>
      <Wrapper minWidth={minWidth}>
        <Bar
          data={{
            labels,
            datasets,
          }}
          options={{
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
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
                position: "nearest",
                external: externalTooltipHandler(symbol, scrollLeft),
                padding: 8,
              },
            },
          }}
        />
      </Wrapper>
    </ScrollableWrapper>
  );
}
