import React from "react";
import { PolarArea } from "react-chartjs-2";
import { sumBy } from "../utils/math";

export default function PolarAreaChart({ data, status, tooltipLabelCallback }) {
  const filteredData = status.labels
    .filter((i) => !i.disabled)
    .map((i) => data.labels.find((d) => d.name === i.name));
  const totalValue = sumBy(filteredData, "value");
  const enabledCount = filteredData.length;

  const unit = 360 / enabledCount;
  const calcAngle = (val) => {
    const ratio = val / totalValue;
    const value = ratio * unit * enabledCount;
    return value || 0.001;
  };
  const angles = filteredData.map((i) => calcAngle(i.value));

  return (
    <PolarArea
      data={{
        labels: filteredData.map((i) => i.name),
        datasets: [
          {
            label: "data",
            data: filteredData.map((i) => i.value),
            backgroundColor: filteredData.map((i) => i.color),
            borderWidth: 0,
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        elements: {
          arc: {
            angle: angles,
          },
        },
        scales: {
          r: {
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label(tooltipItem) {
                return tooltipLabelCallback?.(tooltipItem);
              },
            },
          },
        },
      }}
    />
  );
}
