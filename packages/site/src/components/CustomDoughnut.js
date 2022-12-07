import {
  ArcElement,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
} from "chart.js";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { sum } from "../utils/math";

ChartJS.register(ArcElement, ChartTooltip);

const DoughnutChart = ({ data, status }) => {
  const findDisabled = (name) => {
    const findFunc = (item) => {
      if (item.name === name) return item.disabled;
      if (item.children) {
        return item.children.find(findFunc);
      }
      return;
    };
    const result = status?.labels?.find(findFunc);
    return result;
  };
  const doughnutData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderWidth: 0,
      },
    ],
  };
  const dataReduce = (acc, current) => {
    if (current.children) {
      return current.children.reduce(dataReduce, acc);
    } else {
      acc.labels.push(current.name);
      acc.datasets[0].data.push(findDisabled(current.name) ? 0 : current.value);
      acc.datasets[0].backgroundColor.push(current.color);
      acc.datasets[0].hoverBackgroundColor.push(current.color);
    }
    return acc;
  };
  data.labels.reduce(dataReduce, doughnutData);
  const options = {
    maintainAspectRatio: false,
    cutoutPercentage: 80,
    animation: { animateRotate: false },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(tooltipItem) {
            const dataset = tooltipItem.dataset;
            const currentValue = tooltipItem.parsed;
            const total = sum(dataset.data);
            const percentage = parseFloat(
              ((currentValue / total) * 100).toFixed(2)
            );
            return percentage + "%";
          },
          title(tooltipItems) {
            return tooltipItems[0].label;
          },
        },
      },
    },
  };
  return <Doughnut data={doughnutData} options={options} />;
};

export default DoughnutChart;
