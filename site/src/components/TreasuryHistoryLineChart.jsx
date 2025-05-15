import { Line } from "react-chartjs-2";
import styled from "styled-components";
import dayjs from "dayjs";
import { useWindowSize } from "react-use";
import { abbreviateBigNumber } from "../utils";
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

const generateData = () => {
  const data = [];
  const now = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  let lastAmount = Math.floor(Math.random() * 2000);

  for (let i = 29; i >= 0; i--) {
    const amount = lastAmount + (Math.random() * 10 - 5);
    data.push({
      amount: Math.round(amount * 10) / 10,
      time: now - i * oneDay,
    });
    lastAmount = amount;
  }
  return data;
};

const sourceData = generateData();

export default function TreasuryHistoryLineChart() {
  const windowSize = useWindowSize();

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
            if ([0, 14, 29].includes(index)) {
              return dayjs(value).format("MMM DD");
            } else {
              return null;
            }
          },
        },
      },
    },
  };

  const labels = sourceData.map?.(({ time }) => time);
  const data = sourceData.map?.(({ amount }) => amount);
  console.log(data.length, labels.length);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        label: "Amount",
        borderWidth: 2,
        borderColor: "#FC7C91",
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 10,
        pointBackgroundColor: "#FC7C91",
        fill: true,
        gradient: {
          backgroundColor: {
            axis: "y",
            colors: {
              0: "rgba(255, 240, 243, 0.00)",
              100: "#FFF0F3",
            },
          },
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
        <Line key={windowSize} options={chartOptions} data={chartData} />
      </ChartWrapper>
    </HistoricalLineChartWrapper>
  );
}
