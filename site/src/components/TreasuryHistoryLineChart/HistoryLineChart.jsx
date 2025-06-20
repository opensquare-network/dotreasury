import { abbreviateBigNumber } from "../../utils";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useWindowSize } from "react-use";
import changeColorAlpha from "../../utils/changeColorAlpha";
import { useTheme } from "styled-components";

export default function HistoryLineChart({ labels, data }) {
  const { width } = useWindowSize();
  const theme = useTheme();

  const chartOptions = useMemo(() => getChartOptions(theme), [theme]);

  const chartData = useMemo(
    () => getChartData(data, labels, theme),
    [data, labels, theme],
  );

  if (!data) {
    return;
  }

  return <Line key={width} options={chartOptions} data={chartData} />;
}

const getChartOptions = (theme) => {
  const tooltipBg = theme.tooltipBg;
  const textPrimaryContrast = theme.textPrimaryContrast;

  return {
    type: "line",
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: textPrimaryContrast,
        bodyColor: textPrimaryContrast,
        mode: "index",
        intersect: false,
        bodySpacing: 8,
        callbacks: {
          afterBody: ([item]) => {
            const balance = abbreviateBigNumber(item.raw);

            return `Total Treasury ${item.raw > 1000 ? "≈" : ""} $` + balance;
          },
          title([item]) {
            return dayjs(Number(item.parsed.x)).format("YYYY-MM-DD");
          },
          label() {
            return null;
          },
        },
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        type: "time",
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        title: {
          padding: {
            left: 0,
          },
        },
        ticks: {
          source: "data",
          maxTicksLimit: 30,
          callback: (value, index, values) => {
            if (values.length < 3) {
              return dayjs(value).format("MMM DD");
            }
            if (
              index === Math.round(values.length / 2) ||
              index === 1 ||
              index === values.length - 1
            ) {
              return dayjs(value).format("MMM DD");
            }
          },
        },
      },
    },
  };
};

const getChartData = (data, labels, theme) => {
  const pink100 = theme.pink100;
  const pink300 = theme.pink300;
  return {
    labels,
    datasets: [
      {
        data,
        label: "Balance",
        borderWidth: 2,
        borderColor: pink300,
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 10,
        pointBackgroundColor: pink300,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top,
          );

          gradient.addColorStop(0, changeColorAlpha(pink100, 0));
          gradient.addColorStop(1, pink100);

          return gradient;
        },
      },
    ],
  };
};
