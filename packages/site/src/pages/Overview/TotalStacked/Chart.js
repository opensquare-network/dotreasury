import React from 'react';
import styled, { css } from "styled-components";
import { Line } from 'react-chartjs-2';
import dayjs from "dayjs";

import Text from "../../../components/Text"

const LegendWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: flex-end;
  & > :not(:last-child) {
    margin-left: 32px;
  }
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 4px;
  & > :first-child {
    margin-right: 12px;
  }
`

const LegendDiv = styled.div`
  ${p => p.icon === "square" && css`
    width: 8px;
    height: 8px;
    background: ${p => p.color};
    border-radius: 1px;
  `}
  ${p => p.icon === "bar" && css`
    width: 12px;
    height: 3px;
    background: ${p => p.color};
    border-radius: 1px;
  `}
`

const LegendTitle = styled(Text)`
  font-weight: 500;
  line-height: 24px;
`

const LineChart = ({ data, onHover }) => {
  const { dates, values }  = data;
  const options = {
    type: 'line',
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          displayFormats: {
            month: 'YYYY-MM'
          },
          unit: 'month',
          unitStepSize: 3
        },
        gridLines: {
          zeroLineWidth: 0,
          color: "rgba(0, 0, 0, 0)",
        },
        ticks: {
          fontFamily: "Inter",
          maxRotation: 0,
          minRotation: 0
        }
      }],
      yAxes: [{
        position: "right",
        ticks: {
          fontFamily: "Inter",
          stepSize: 100000
        }
      }]
    },
    tooltips: {
      mode: 'index',
      callbacks: {
        title: function(tooltipItems) {
          return dayjs(tooltipItems[0].xLabel).format("YYYY-MM-DD");
        }
      }
    },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    onHover: function(_, array) {
      const index = array?.[0]?._index;
      onHover(index)
    }
  }
  const chartData = {
    labels: dates,
    datasets: (values || []).map(item => ({
      label: item.label,
      fill: item.fill,
      lineTension: 0,
      backgroundColor: item.secondaryColor,
      borderColor: item.primaryColor,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: item.primaryColor,
      pointBackgroundColor: item.primaryColor,
      pointBorderWidth: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: item.primaryColor,
      pointHoverBorderColor: item.primaryColor,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: item.data
    }))
  }

  if (dates && dates.length > 0) {
    return (
      <>
        <LegendWrapper>
          {(values || []).map((item, index) => (
            <TitleWrapper key={index}>
              <LegendDiv color={item.primaryColor} icon={item.icon} />
              <LegendTitle>{item.label}</LegendTitle>
            </TitleWrapper>)
          )}
        </LegendWrapper>
        <Line data={chartData} options={options} />
      </>
    )} else {
    return null;
  }
};

export default LineChart;
