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
  padding: 32px;
  @media screen and (min-width: 1140px) {
    & > :first-child {
      margin-right: 24px;
    }
  }
  @media screen and (max-width: 1140px) {
    flex-direction: column;
    & > :first-child {
      margin-bottom: 24px;
    }
  }
`;

const ChartWrapper = styled.div`
  height: 252px;
  min-width: 252px;
  flex-grow: 1;
  margin-bottom: 24px;
`;

const ListWrapper = styled.div`
  display: flex;
  @media screen and (min-width: 556px) {
    & > :first-child {
      margin-right: 24px;
    }
  }
  @media screen and (max-width: 556px) {
    flex-direction: column;
    & > :first-child {
      margin-bottom: 24px;
    }
  }
`;

const SecondListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (max-width: 556px) {
    & > :first-child {
      margin-bottom: 24px;
    }
  }
`;

const TotalStacked = () => {
  const dispatch = useDispatch();
  const [dateLabels, setDateLabels] = useState([]);
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [outputHistory, setOutputHistory] = useState([]);
  const [treasuryHistory, setTreasuryHistory] = useState([]);
  const [showIndex, setShowIndex] = useState();
  const [incomeData, setIncomeData] = useState({
    title: "Income",
    icon: "square",
    labels: [
      {
        name: "Inflation",
        value: 0,
      },
      {
        name: "Slashes",
        children: [
          {
            name: "Staking",
            value: 0,
          },
          {
            name: "Treasury",
            value: 0,
          },
          {
            name: "Election",
            value: 0,
          },
          {
            name: "Democracy",
            value: 0,
          },
          {
            name: "Identity",
            value: 0,
          },
        ],
      },
      {
        name: "Others",
        value: 0,
      },
    ],
  });
  const [outputData, setOutputData] = useState({
    title: "Output",
    icon: "square",
    labels: [
      {
        name: "Proposal",
        value: 0,
      },
      {
        name: "Tips",
        value: 0,
      },
      {
        name: "Bounties",
        value: 0,
      },
      {
        name: "Burnt",
        value: 0,
      },
    ],
  });
  const [treasuryData, setTreasuryData] = useState({
    title: "Treasury",
    icon: "square",
    labels: [
      {
        name: "Balance",
        value: 0,
      },
    ],
  });

  useEffect(() => {
    dispatch(fetchStatsHistory());
  }, [dispatch]);

  const statsHistory = useSelector(statsHistorySelector);

  useEffect(() => {
    const dateLabels = statsHistory.map(
      (statsItem) => statsItem.indexer.blockTime
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

    const treasuryHistory = statsHistory.map((statsItem) =>
      toPrecision(statsItem.treasuryBalance, 12, false)
    );
    setTreasuryHistory(treasuryHistory);
  }, [statsHistory]);

  useEffect(() => {
    if (statsHistory && statsHistory.length > 0) {
      const index = showIndex ?? statsHistory.length - 1;
      const statsData = statsHistory[index];
      setIncomeData({
        title: "Income",
        date: dayjs(dateLabels?.[index]).format("YYYY-MM-DD"),
        icon: "square",
        labels: [
          {
            name: "Inflation",
            value: toPrecision(statsData.income.inflation, 12, false),
          },
          {
            name: "Slashes",
            children: [
              {
                name: "Staking",
                value: toPrecision(
                  statsData.income.slashSeats.staking,
                  12,
                  false
                ),
              },
              {
                name: "Treasury",
                value: toPrecision(
                  statsData.income.slashSeats.treasury,
                  12,
                  false
                ),
              },
              {
                name: "Election",
                value: toPrecision(
                  statsData.income.slashSeats.electionsPhragmen,
                  12,
                  false
                ),
              },
              {
                name: "Democracy",
                value: toPrecision(
                  statsData.income.slashSeats.democracy,
                  12,
                  false
                ),
              },
              {
                name: "Identity",
                value: toPrecision(
                  statsData.income.slashSeats.identity,
                  12,
                  false
                ),
              },
            ],
          },
          {
            name: "Others",
            value: toPrecision(statsData.income.others, 12, false),
          },
        ],
      });

      setOutputData({
        title: "Output",
        date: dayjs(dateLabels?.[index]).format("YYYY-MM-DD"),
        icon: "square",
        labels: [
          {
            name: "Proposal",
            value: toPrecision(statsData.output.proposal, 12, false),
          },
          {
            name: "Tips",
            value: toPrecision(statsData.output.tip, 12, false),
          },
          {
            name: "Bounties",
            value: toPrecision(statsData.output.bounty, 12, false),
          },
          {
            name: "Burnt",
            value: toPrecision(statsData.output.burnt, 12, false),
          },
        ],
      });

      setTreasuryData({
        title: "Treasury",
        date: dayjs(dateLabels?.[index]).format("YYYY-MM-DD"),
        icon: "square",
        labels: [
          {
            name: "Balance",
            value: toPrecision(statsData.treasuryBalance, 12, false),
          },
        ],
      });
    }
  }, [showIndex, statsHistory, dateLabels]);

  const chartData = {
    dates: dateLabels,
    values: [
      {
        label: "Income",
        primaryColor: "#DF405D",
        secondaryColor: "#FFEEF1",
        data: incomeHistory,
        fill: true,
        icon: "square",
        order: 2,
      },
      {
        label: "Output",
        primaryColor: "#FED077",
        secondaryColor: "#FFEDC9",
        data: outputHistory,
        fill: true,
        icon: "square",
        order: 1,
      },
      {
        label: "Treasury Balance",
        primaryColor: "#FBA06E",
        secondaryColor: "#FBA06E",
        data: treasuryHistory,
        fill: false,
        icon: "bar",
        order: 0,
      },
    ],
  };

  const onHover = (index) => {
    setShowIndex(index);
  };

  return (
    <>
      <Title>Total Stacked</Title>
      <CardWrapper>
        <ListWrapper>
          <List data={incomeData}></List>
          <SecondListWrapper>
            <List data={outputData}></List>
            <List data={treasuryData}></List>
          </SecondListWrapper>
        </ListWrapper>
        <ChartWrapper>
          <Chart data={chartData} onHover={onHover} />
        </ChartWrapper>
      </CardWrapper>
    </>
  );
};

export default TotalStacked;
