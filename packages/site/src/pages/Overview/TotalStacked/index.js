import React from "react";
import styled from "styled-components";

import Text from "../../../components/Text";
import Card from "../../../components/Card";
import List from "../CustomList";
import Chart from "./Chart";

const Title = styled(Text)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const CardWrapper = styled(Card)`
  display: flex;
  flex-wrap: wrap;
  padding: 32px;
  & > :not(:last-child) {
    margin-right: 24px;
  }
`;

const ChartWrapper = styled.div`
  height: 300px;
  width: 752px;
`

const TotalStacked = () => {
  const IncomeData = {
    title: "Income",
    icon: "square",
    labels: [
      {
        name: "Inflation",
        value: 64706,
      },
      {
        name: "Slashes",
        children: [
          {
            name: "Treasury",
            value: 153
          },
          {
            name: "Staking",
            value: 253
          },
          {
            name: "Democracy",
            value: 353
          },
          {
            name: "Election",
            value: 53
          },
          {
            name: "Identity",
            value: 153
          },
        ]
      },
      {
        name: "Others",
        value: 1165
      },
    ]
  };
  const outputData = {
    title: "Output",
    icon: "square",
    labels: [
      {
        name: "Proposal",
        value: 4553,
      },
      {
        name: "Tips",
        value: 1165,
      },
      {
        name: "Bounties",
        value: 1165,
      },
      {
        name: "Burnt",
        value: 1165,
      },
    ]
  }
  const chartData = {
    dates: ['YY-MM', 'YY-MM', 'YY-MM', 'YY-MM', 'YY-MM', 'YY-MM', 'YY-MM', 'YY-MM'],
    values: [
      {
        label: "Output",
        primaryColor: "#FED077",
        secondaryColor: "#FFEDC9",
        data: [0, 50, 150, 200, 300, 400, 500, 550]
      },
      {
        label: "Total",
        primaryColor: "#DF405D",
        secondaryColor: "#FFEEF1",
        data: [0, 100, 300, 350, 550, 800, 950, 1000]
      }
    ]
  }

  return (
    <>
      <Title>Total Stacked</Title>
      <CardWrapper>
        <List data={IncomeData}></List>
        <List data={outputData}></List>
        <ChartWrapper>
          <Chart data={chartData} />
        </ChartWrapper>
      </CardWrapper>
    </>
  )
}

export default TotalStacked;
