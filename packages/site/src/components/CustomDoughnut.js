import React from "react";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({ data }) => {
    const doughnutData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
          borderWidth: 0,
        }
      ]
    }
    const dataReduce = (acc, current) => {
      if (current.children) {
        return current.children.reduce(dataReduce, acc);
      } else {
        acc.labels.push(current.name);
        acc.datasets[0].data.push(current.value);
        acc.datasets[0].backgroundColor.push(current.color);
        acc.datasets[0].hoverBackgroundColor.push(current.color);
      }
      return acc;
    }
    data.labels.reduce(dataReduce, doughnutData);
  // const data = {
  //   labels: ["Proposals", "Tips", "Bounties", "Burnt"],
  //   datasets: [
  //     {
  //       data: [proposals, tips, bounties, burnt],
  //       backgroundColor: [
  //         OVERVIEW_PROPOSALS_COLOR,
  //         OVERVIEW_TIPS_COLOR,
  //         OVERVIEW_BOUNTIES_COLOR,
  //         OVERVIEW_BURNT_COLOR,
  //       ],
  //       hoverBackgroundColor: [
  //         OVERVIEW_PROPOSALS_COLOR,
  //         OVERVIEW_TIPS_COLOR,
  //         OVERVIEW_BOUNTIES_COLOR,
  //         OVERVIEW_BURNT_COLOR,
  //       ],
  //       borderWidth: 0,
  //     },
  //   ],
  // };
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
  return <Doughnut data={doughnutData} options={options} />;
};

export default DoughnutChart;
