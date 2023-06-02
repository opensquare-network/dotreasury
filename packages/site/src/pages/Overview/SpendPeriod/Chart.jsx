import React from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";

const ScrollableWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  overflow-x: auto;
`;

const Wrapper = styled.div`
  display: flex;
  min-width: ${p => p.minWidth}px;
`;

export default function Chart({ legends, data = [] }) {
  const categoryPercentage = 0.7;
  const barPercentage = 0.7;

  const minWidth = (data.length || 0) * 20;

  const labels = data.map((_, index) => `${index + 1}`);
  let datasets = legends.map(legend => {
    return {
      categoryPercentage,
      barPercentage,
      label: legend.label,
      data: data.map(legend.getValue),
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
                    return `Period #${labels[index]}`;
                  },
                  label(item) {
                    const raw = item.raw;
                    return `${item.dataset.label}: ${raw}`;
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
