import { Bar } from "react-chartjs-2";
import styled, { css } from "styled-components";
import Text from "../Text";
import { getPrecision, toPrecision } from "../../utils";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  Tooltip as ChartTooltip,
  LinearScale,
  Title as ChartTitle,
  ArcElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  ChartTooltip,
  Legend,
  CategoryScale
);

const Wrapper = styled.div`
  padding-left: 17px;
  padding-right: 17px;
  background-color: #ffffff;
  margin-bottom: 24px;
  overflow: scroll;
`;

const ChartWrapper = styled.div`
  position: relative;
  overflow: scroll;
  ${(props) => {
    return (
      props &&
      props.w &&
      css`
        width: max(${props.w}, 100%);
      `
    );
  }}
`;

const HeaderWrapper = styled.div`
  margin-left: -17px;
  margin-right: -17px;
  padding: 20px 24px;
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`;

function Burnt({ chartData, symbol }) {
  if (!chartData) {
    return null;
  }

  const formatDate = (time) => {
    var d = new Date(time),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  chartData = chartData
    .map((bar) => ({ date: formatDate(bar.timestamp), brunt: bar.amount }))
    .reverse();

  chartData.forEach(() => chartData[0].brunt === 0 && chartData.shift());

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        // these are needed because the bar controller defaults set only the first xaxis properties
        type: "category",
        display: false,
        stacked: true,
        offset: true,
      },
      y: {
        display: false,
        stacked: false,
        ticks: {
          beginAtZero: true,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        yAlign: "bottom",
        caretPadding: -40,
        bodySpacing: 8,
        callbacks: {
          title(tooltipItems) {
            return tooltipItems[0].label;
          },
          label(tooltipItem) {
            const { label } = tooltipItem.dataset;

            if (label === "Latest") {
              return "";
            }

            const value = tooltipItem.parsed.y;

            const precision = toPrecision(value, getPrecision(symbol), false);
            const localePrecision = Number(precision).toLocaleString();
            return `${label} ≈ ${localePrecision} ${symbol}`;
          },
        },
        itemSort: function (a, b) {
          return a.datasetIndex - b.datasetIndex;
        },
      },
    },
  };

  const data = {
    labels: chartData.map((bar) => bar.date),
    datasets: [
      {
        label: "Burnt",
        backgroundColor: "#FC7C91",
        hoverBackgroundColor: "#F23252",
        borderWidth: 1,
        borderColor: "#FC7C91",
        hoverBorderColor: "#f23252",
        barThickness: 6,
        data: chartData.map((bar) => bar.brunt),
      },
      {
        label: "Latest",
        backgroundColor: "#f4f4f4",
        borderWidth: 4,
        borderColor: "#ffffff",
        barThickness: 14,
        data: chartData.map(() => chartData[chartData.length - 1].brunt * 1.2),
      },
    ],
  };
  return (
    <Wrapper>
      <HeaderWrapper>
        <Title>Burnt</Title>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="24"
          viewBox="0 0 48 24"
          fill="none"
        >
          <rect width="48" height="24" rx="4" fill="#FFE6EA" />
          <path
            d="M18.0551 17L19.0061 14.3224H22.8286L23.7796 17H24.9798L21.5083 7.54545H20.3264L16.8548 17H18.0551ZM19.3662 13.3068L20.8804 9.04119H20.9543L22.4685 13.3068H19.3662ZM27.3943 7.54545H26.3048V17H27.3943V7.54545ZM30.4792 7.54545H29.3897V17H30.4792V7.54545Z"
            fill="#F23252"
          />
        </svg>
      </HeaderWrapper>
      <div style={{ overflow: "scroll", direction: "rtl" }}>
        <ChartWrapper
          w={chartData.length > 18 ? `${chartData.length * 14}px` : "100%"}
          style={{
            height: chartData.length < 20 ? 120 : 100,
            marginTop: chartData.length < 20 ? 0 : 20,
          }}
        >
          <Bar width={1200} options={options} data={data} />
        </ChartWrapper>
      </div>
    </Wrapper>
  );
}

export default Burnt;
