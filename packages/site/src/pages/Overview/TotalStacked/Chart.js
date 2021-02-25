import React from 'react';
import styled from "styled-components";
import { Line } from 'react-chartjs-2';

import Text from "../../../components/Text"

const LegendWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 22px;
  & > :first-child {
    margin-right: 32px;
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
  width: 8px;
  height: 8px;
  background: ${p => p.color};
  border-radius: 1px;
`

const LegendTitle = styled(Text)`
  font-weight: 500;
  line-height: 24px;
`

const options = {
  scales: {
    xAxes: [{
      gridLines: {
          color: "rgba(0, 0, 0, 0)",
      },
    }],
    yAxes: [{
      position: 'right',
      ticks: {
        stepSize: 200
      }
    }]
  },
  legend: {
    display: false,
  },
  maintainAspectRatio: false
}

const Chart = ({ data }) => {
  const { dates, values }  = data;
  const chartData = {
    labels: dates,
    datasets: (values || []).map(item => ({
      label: item.label,
      fill: true,
      lineTension: 0,
      backgroundColor: item.secondaryColor,
      borderColor: item.primaryColor,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#FFF',
      pointBackgroundColor: item.primaryColor,
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: item.secondaryColor,
      pointHoverBorderColor: item.primaryColor,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: item.data
    }))
  }

  return (
    <>
      <LegendWrapper>
        {(values || []).reverse().map((item, index) => (
          <TitleWrapper key={index}>
            <LegendDiv color={item.primaryColor} />
            <LegendTitle>{item.label}</LegendTitle>
          </TitleWrapper>)
        )}
      </LegendWrapper>
      <Line data={chartData} options={options} height={220} width={700} />
    </>
  );
};

export default Chart;
