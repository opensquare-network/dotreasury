import React from "react";
import styled, { css } from "styled-components";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

import Text from "../../../components/Text";
import { useSelector } from "react-redux";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { abbreviateBigNumber } from "../../../utils";
import "../../../components/Charts/adapterDayjs";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  TimeScale,
  Filler
);

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

const LineChart = ({ data, onHover }) => {
  const chain = useSelector(chainSelector);
  const { dates, values } = data;

  /** @type {import("react-chartjs-2").ChartProps} */
  const options = {
    type: "line",
    hover: {
      mode: "nearest",
      intersect: true,
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
              "YYYY-MM-DD hh:mm"
            );
          },
          label(tooltipItem) {
            return `${tooltipItem.dataset.label} ${
              Math.round(tooltipItem.raw) === tooltipItem.raw ? "" : "≈"
            } ${parseInt(tooltipItem.raw)}`;
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
    maintainAspectRatio: false,
    onHover: function (_, array) {
      const index = array?.[0]?._index;
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

  if (dates && dates.length > 0) {
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
        <Line data={chartData} options={options} />
      </>
    );
  } else {
    return null;
  }
};

export default LineChart;
