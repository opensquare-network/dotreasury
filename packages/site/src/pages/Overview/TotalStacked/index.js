import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { bnToBn } from "@polkadot/util";
import dayjs from "dayjs";

import Text from "../../../components/Text";
import Card from "../../../components/Card";
import List from "../CustomList";
import Chart from "./Chart";
import { toPrecision } from "../../../utils";

import {
  fetchStatsHistory,
  statsHistorySelector,
} from "../../../store/reducers/overviewSlice";

const Title = styled(Text)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const CardWrapper = styled(Card)`
  display: flex;
  flex-wrap: wrap;
  padding: 32px 32px 16px;
  & > :not(:last-child) {
    margin-right: 24px;
  }
  & > * {
    margin-bottom: 16px;
  }
`;

const ChartWrapper = styled.div`
  height: 252px;
  min-width: 252px;
  max-width: 752px;
  flex-grow: 1;
`;

const TotalStacked = () => {
  const dispatch = useDispatch();
  const [dateLabels, setDateLabels] = useState([]);
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [outputHistory, setOutputHistory] = useState([]);

  useEffect(() => {
    dispatch(fetchStatsHistory());
  }, [dispatch]);

  const statsHistory = useSelector(statsHistorySelector);

  useEffect(() => {
    const dateLabels = statsHistory.map((statsItem) =>
      dayjs(statsItem.indexer.blockTime).format("YYYY-MM")
    );
    setDateLabels(dateLabels);

    const incomeHistory = statsHistory
      .map((statsItem) =>
        bnToBn(statsItem.income.inflation)
          .add(bnToBn(statsItem.income.slash))
          .add(bnToBn(statsItem.income.others))
      )
      .map((bn) => toPrecision(bn, 12, false));
    setIncomeHistory(incomeHistory);

    const outputHistory = statsHistory
      .map((statsItem) =>
        bnToBn(statsItem.output.tip)
          .add(bnToBn(statsItem.output.proposal))
          .add(bnToBn(statsItem.output.bounty))
          .add(bnToBn(statsItem.output.burnt))
      )
      .map((bn) => toPrecision(bn, 12, false));
    setOutputHistory(outputHistory);
  }, [statsHistory]);

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
            name: "Staking",
            value: 253,
          },
          {
            name: "Treasury",
            value: 153,
          },
          {
            name: "Election",
            value: 53,
          },
          {
            name: "Democracy",
            value: 353,
          },
          {
            name: "Identity",
            value: 153,
          },
        ],
      },
      {
        name: "Others",
        value: 1165,
      },
    ],
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
    ],
  };
  const chartData = {
    dates: dateLabels,
    values: [
      {
        label: "Output",
        primaryColor: "#FED077",
        secondaryColor: "#FFEDC9",
        data: outputHistory,
      },
      {
        label: "Total",
        primaryColor: "#DF405D",
        secondaryColor: "#FFEEF1",
        data: incomeHistory,
      },
    ],
  };

  return (
    <>
      <Title>Total Stacked</Title>
      <CardWrapper>
        <ChartWrapper>
          <Chart data={chartData} />
        </ChartWrapper>
        <List data={IncomeData}></List>
        <List data={outputData}></List>
      </CardWrapper>
    </>
  );
};

export default TotalStacked;
