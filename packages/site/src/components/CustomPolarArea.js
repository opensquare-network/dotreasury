import React from "react";
import { PolarArea } from "react-chartjs-2";

export default function PolarAreaChart({ data, status }) {
  console.log(status);

  const filteredData = status.labels
    .filter((i) => !i.disabled)
    .map((i) => data.labels.find((d) => d.name === i.name));

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
        },
      }}
    />
  );
}
