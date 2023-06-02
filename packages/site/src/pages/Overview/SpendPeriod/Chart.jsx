import React from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import dayjs from "dayjs";

const ScrollableWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-grow: 1;
  overflow-x: auto;

  ::-webkit-scrollbar {
    display: block;
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  min-width: ${p => p.minWidth}px;
`;


export default function Chart({ legends, data = [] }) {
  const symbol = useSelector(chainSymbolSelector);

  const categoryPercentage = 0.7;
  const barPercentage = 0.7;

  const minWidth = (data.length || 0) * 20;

  const labels = data.map((item) => dayjs(item.endIndexer.blockTime).format("YYYY-MM-DD"));
  let datasets = legends.map(legend => {
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
    <ScrollableWrapper>
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
                position: "average",
                displayColors: false,
                callbacks: {
                  title(item) {
                    const index = item[0].dataIndex;
                    return `${labels[index]}`;
                  },
                  label(item) {
                    const raw = item.raw;
                    if (raw === 0) return "";

                    const count = item.dataset.counts[item.dataIndex];
                    const fiat = item.dataset.fiats[item.dataIndex];
                    return `${item.dataset.label}(${count}): ≈$${fiat.toFixed(0).toLocaleString()} (≈${raw.toFixed(3).toLocaleString()} ${symbol})`;
                  },
                },
              },
            },
          }}
        />
      </Wrapper>
    </ScrollableWrapper>
  );
}
