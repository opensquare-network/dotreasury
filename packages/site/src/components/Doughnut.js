import React from "react";
import { Doughnut } from "react-chartjs-2";

import {
  OVERVIEW_PROPOSALS_COLOR,
  OVERVIEW_TIPS_COLOR,
  OVERVIEW_BOUNTIES_COLOR,
  OVERVIEW_BURNT_COLOR,
} from "../constants";

const DoughnutChart = ({ proposals, tips, bounties, burnt }) => {
  const data = {
    labels: ["Proposals", "Tips", "Bounties", "Burnt"],
    datasets: [
      {
        data: [proposals, tips, bounties, burnt],
        backgroundColor: [
          OVERVIEW_PROPOSALS_COLOR,
          OVERVIEW_TIPS_COLOR,
          OVERVIEW_BOUNTIES_COLOR,
          OVERVIEW_BURNT_COLOR,
        ],
        hoverBackgroundColor: [
          OVERVIEW_PROPOSALS_COLOR,
          OVERVIEW_TIPS_COLOR,
          OVERVIEW_BOUNTIES_COLOR,
          OVERVIEW_BURNT_COLOR,
        ],
        borderWidth: 0,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    cutoutPercentage: 80,
    animation: { animateRotate: false },
    legend: {
      display: false,
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const meta = dataset._meta[Object.keys(dataset._meta)[0]];
          const total = meta.total;
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = parseFloat(
            ((currentValue / total) * 100).toFixed(2)
          );
          return percentage + "%";
        },
        title: function (tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        },
      },
    },
  };
  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
