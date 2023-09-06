import React from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

import "../../../components/Charts/globalConfig";
import Text from "../../../components/Text";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { abbreviateBigNumber } from "../../../utils";
import { h_full } from "../../../styles/tailwindcss";

const LegendWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  & > :not(:last-child) {
    margin-right: 16px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 4px;
  & > :first-child {
    margin-right: 12px;
  }
`;

const LegendDiv = styled.div`
  ${(p) =>
    p.icon === "square" &&
    css`
      width: 8px;
      height: 8px;
      background: ${(p) => p.color};
      border-radius: 1px;
    `}
  ${(p) =>
    p.icon === "bar" &&
    css`
      width: 12px;
      height: 3px;
      background: ${(p) => p.color};
      border-radius: 1px;
    `}
`;

const LegendTitle = styled(Text)`
  font-weight: 500;
  line-height: 24px;
`;

const ChartWrapper = styled.div`
  ${h_full};
  flex-grow: 1;
  min-width: 252px;
`;

const LineChart = ({ data, onHover }) => {
  const chain = useSelector(chainSelector);
  const { dates, values } = data;

  /** @type {import("react-chartjs-2").ChartProps} */
  const options = {
    type: "line",
    responsive: true,
    maintainAspectRatio: false,
    hover: {
      mode: "nearest",
      intersect: true,
    },
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        bodySpacing: 8,
        callbacks: {
          title(tooltipItems) {
            return dayjs(Number(tooltipItems[0].parsed.x)).format(
              "YYYY-MM-DD hh:mm",
            );
          },
          label(tooltipItem) {
            return `${tooltipItem.dataset.label} ${
              Math.round(tooltipItem.raw) === tooltipItem.raw ? "" : "≈"
            } ${parseInt(tooltipItem.raw).toLocaleString()}`;
          },
        },
        itemSort: function (a, b) {
          return a.datasetIndex - b.datasetIndex;
        },
      },
    },
    scales: {
      y: {
        position: "right",
        ticks: {
          stepSize: chain === "kusama" ? 200000 : 8000000,
          callback: (y) => abbreviateBigNumber(y),
        },
        grid: {
          drawTicks: false,
        },
      },
      x: {
        type: "time",
        time: {
          displayFormats: {
            month: "YYYY-MM",
          },
          unit: "month",
        },
        grid: {
          zeroLineWidth: 0,
          color: "rgba(0, 0, 0, 0)",
        },
        ticks: {
          stepSize: 3,
        },
      },
    },
    onHover: function (_, array) {
      const index = array?.[0]?.index;
      onHover(index);
    },
  };
  const chartData = {
    labels: dates,
    datasets: (values || []).map((item) => ({
      label: item.label,
      fill: item.fill,
      lineTension: 0,
      backgroundColor: item.secondaryColor,
      borderColor: item.primaryColor,
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: item.primaryColor,
      pointBackgroundColor: item.primaryColor,
      pointBorderWidth: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: item.primaryColor,
      pointHoverBorderColor: item.primaryColor,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: item.data,
      order: item.order,
    })),
  };

  return (
    <>
      <LegendWrapper>
        {(values || []).map((item, index) => (
          <TitleWrapper key={index}>
            <LegendDiv color={item.primaryColor} icon={item.icon} />
            <LegendTitle>{item.label}</LegendTitle>
          </TitleWrapper>
        ))}
      </LegendWrapper>
      <ChartWrapper>
        <Line data={chartData} options={options} />
      </ChartWrapper>
    </>
  );
};

export default LineChart;
