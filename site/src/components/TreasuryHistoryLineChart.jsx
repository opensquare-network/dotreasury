import styled from "styled-components";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useWindowSize } from "react-use";
import { abbreviateBigNumber } from "../utils";
import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import SkeletonBar from "./skeleton/bar";

const HistoricalLineChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 8px;
  width: calc((100% - (48px * 3)) / 4);
  @media screen and (max-width: 1024px) {
    width: calc((100% - (48px * 1)) / 2);
    min-height: 132px;
  }
  @media screen and (max-width: 768px) {
    margin-top: 24px;
    width: 100%;
    min-height: 132px;
  }
`;

const ChartTitle = styled.div`
  color: rgba(27, 32, 44, 0.6);
  text-align: end;
  width: 100%;
  text-align: right;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
`;

const ChartWrapper = styled.div`
  // height: 84px;
  weidth: 100%;
  flex: 1;
`;

function generateRandomBigNumber(length = 22) {
  let result = "";
  result += Math.floor(1 + Math.random() * 9).toString();
  for (let i = 1; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

const generateData = (key = "balance", rang = 1000) => {
  const data = [];
  const now = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  for (let i = 29; i >= 0; i--) {
    data.push({
      [key]: generateRandomBigNumber(),
      time: now - i * oneDay,
    });
  }
  return data;
};

const sourceData = generateData("balance", 10000);

const useFetchData = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return {
    loading,
    data: loading ? [] : sourceData,
  };
};

export default function TreasuryHistoryLineChart() {
  const windowSize = useWindowSize();
  const { loading, data: sourceData } = useFetchData();
  const { label: labels, data } = useMemo(() => {
    return sourceData.reduce(
      (result, item) => {
        result.data.push(item.balance);
        result.label.push(item.time);
        return result;
      },
      {
        label: [],
        data: [],
      },
    );
  }, [sourceData]);

  const chartOptions = {
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
          label(tooltipItem) {
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
            if ([2, 14, 27].includes(index)) {
              return dayjs(value).format("MMM DD");
            } else {
              return null;
            }
          },
        },
      },
    },
  };

  const chartData = {
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
  };
  return (
    <HistoricalLineChartWrapper>
      <ChartTitle>
        Treasury History($) <span>·</span> Last 30d
      </ChartTitle>
      {/* - */}
      <ChartWrapper>
        {loading ? (
          <SkeletonBar width={"100%"} height={"100%"} />
        ) : (
          <Line key={windowSize} options={chartOptions} data={chartData} />
        )}
      </ChartWrapper>
    </HistoricalLineChartWrapper>
  );
}
