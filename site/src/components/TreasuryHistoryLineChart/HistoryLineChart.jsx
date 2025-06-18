import { abbreviateBigNumber } from "../../utils";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useWindowSize } from "react-use";

export default function HistoryLineChart({ labels, data }) {
  const chartOptions = useMemo(
    () => ({
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
    }),
    [],
  );

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data,
          label: "Balance",
          borderWidth: 2,
          borderColor: "#FC7C91",
          pointBorderWidth: 0,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHitRadius: 10,
          pointBackgroundColor: "#FC7C91",
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
            gradient.addColorStop(0, "rgba(255, 240, 243, 0.00)");
            gradient.addColorStop(1, "#FFF0F3");

            return gradient;
          },
        },
      ],
    }),
    [data, labels],
  );
  const windowSize = useWindowSize();
  if (!data) {
    return;
  }

  return <Line key={windowSize} options={chartOptions} data={chartData} />;
}
