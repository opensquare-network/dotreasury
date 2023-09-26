import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { bnToBn } from "@polkadot/util";
import dayjs from "dayjs";
import { useTheme } from "../../../context/theme";

import Text from "../../../components/Text";
import Card from "../../../components/Card";
import ListOrigin from "../CustomList";
import Chart from "./Chart";
import { getPrecision, toPrecision } from "../../../utils";

import {
  fetchStatsHistory,
  statsHistorySelector,
} from "../../../store/reducers/overviewSlice";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import { h4_16_semibold, p_12_normal } from "../../../styles/text";
import {
  gap,
  justify_between,
  p_b,
  w,
  w_full,
} from "../../../styles/tailwindcss";
import { breakpoint } from "../../../styles/responsive";
import { useSupportOpenGov } from "../../../utils/hooks/chain";
import Slider from "../../../components/Slider";

const CardWrapper = styled(Card)`
  padding: 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
  margin-bottom: 16px;
`;

const Title = styled(Text)`
  margin-bottom: 16px;
  ${h4_16_semibold};
`;

const ContentWrapper = styled.div`
  display: flex;
  ${justify_between};
  ${gap(72)};
  @media screen and (max-width: 1140px) {
    flex-direction: column;
    ${gap(24)};
  }
`;

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0 32px 0;
  ${p_12_normal}
  margin-right: 36px;
`;

const ChartAndSlider = styled.div`
  display: flex;
  flex-direction: column;
  ${justify_between};
  flex-grow: 1;
  ${p_b(24)};
  overflow: auto;
`;

const List = styled(ListOrigin)`
  ${w(276)};
  ${breakpoint(600, w_full)};
`;
const ListWrapper = styled.div`
  display: flex;
  @media screen and (min-width: 600px) {
    & > :first-child {
      margin-right: 24px;
    }
  }
  @media screen and (max-width: 600px) {
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
  @media screen and (max-width: 600px) {
    & > :first-child {
      margin-bottom: 24px;
    }
  }
`;

const TotalStacked = () => {
  const theme = useTheme();
  const supportOpenGov = useSupportOpenGov();
  const dispatch = useDispatch();
  const [dateLabels, setDateLabels] = useState([]);
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [outputHistory, setOutputHistory] = useState([]);
  const [treasuryHistory, setTreasuryHistory] = useState([]);
  const [showIndex, setShowIndex] = useState();
  const [chartRange, setChartRange] = useState([0, 0]);
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
          ...(supportOpenGov
            ? [
                {
                  name: "Referenda",
                  value: 0,
                },
                {
                  name: "Fellowship",
                  value: 0,
                },
              ]
            : []),
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
      {
        name: "Transfer",
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

  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  useEffect(() => {
    dispatch(fetchStatsHistory());
  }, [dispatch]);

  const statsHistory = useSelector(statsHistorySelector);

  useEffect(() => {
    const dateLabels = statsHistory.map(
      (statsItem) => statsItem.indexer.blockTime,
    );
    setDateLabels(dateLabels);
    setChartRange([0, dateLabels.length - 1]);

    const incomeHistory = statsHistory
      .map((statsItem) =>
        bnToBn(statsItem.income.inflation)
          .add(bnToBn(statsItem.income.slash))
          .add(bnToBn(statsItem.income.transfer))
          .add(bnToBn(statsItem.income.others)),
      )
      .map((bn) => toPrecision(bn, precision, false));
    setIncomeHistory(incomeHistory);

    const outputHistory = statsHistory
      .map((statsItem) =>
        bnToBn(statsItem.output.tip)
          .add(bnToBn(statsItem.output.proposal))
          .add(bnToBn(statsItem.output.bounty))
          .add(bnToBn(statsItem.output.burnt))
          .add(bnToBn(statsItem.output.transfer)),
      )
      .map((bn) => toPrecision(bn, precision, false));
    setOutputHistory(outputHistory);

    const treasuryHistory = statsHistory.map((statsItem) =>
      toPrecision(statsItem.treasuryBalance, precision, false),
    );
    setTreasuryHistory(treasuryHistory);
  }, [statsHistory, precision]);

  useEffect(() => {
    if (statsHistory && statsHistory.length > 0) {
      const index = showIndex ?? statsHistory.length - 1;
      const statsData = statsHistory[index];
      setIncomeData({
        title: "Income",
        date: dayjs(dateLabels?.[index]).format("YYYY-MM-DD hh:mm"),
        icon: "square",
        labels: [
          {
            name: "Inflation",
            color: theme.pink500,
            value: toPrecision(statsData.income.inflation, precision, false),
          },
          {
            name: "Slashes",
            color: theme.pink500,
            children: [
              {
                name: "Staking",
                color: "transparent",
                value: toPrecision(
                  statsData.income.slashSeats.staking,
                  precision,
                  false,
                ),
              },
              {
                name: "Treasury",
                color: "transparent",
                value: toPrecision(
                  statsData.income.slashSeats.treasury,
                  precision,
                  false,
                ),
              },
              {
                name: "Election",
                color: "transparent",
                value: toPrecision(
                  statsData.income.slashSeats.election,
                  precision,
                  false,
                ),
              },
              {
                name: "Democracy",
                color: "transparent",
                value: toPrecision(
                  statsData.income.slashSeats.democracy,
                  precision,
                  false,
                ),
              },
              {
                name: "Identity",
                color: "transparent",
                value: toPrecision(
                  statsData.income.slashSeats.identity,
                  precision,
                  false,
                ),
              },
              ...(supportOpenGov
                ? [
                    {
                      name: "Referenda",
                      color: "transparent",
                      value: toPrecision(
                        statsData.income.slashSeats.referenda || 0,
                        precision,
                        false,
                      ),
                    },
                    {
                      name: "Fellowship",
                      color: "transparent",
                      value: toPrecision(
                        statsData.income.slashSeats.fellowshipReferenda || 0,
                        precision,
                        false,
                      ),
                    },
                  ]
                : []),
            ],
          },
          {
            name: "Others",
            color: theme.pink500,
            value: toPrecision(statsData.income.others, precision, false),
          },
        ],
      });

      setOutputData({
        title: "Output",
        date: dayjs(dateLabels?.[index]).format("YYYY-MM-DD hh:mm"),
        icon: "square",
        labels: [
          {
            name: "Proposal",
            color: theme.yellow500,
            value: toPrecision(statsData.output.proposal, precision, false),
          },
          {
            name: "Tips",
            color: theme.yellow500,
            value: toPrecision(statsData.output.tip, precision, false),
          },
          {
            name: "Bounties",
            color: theme.yellow500,
            value: toPrecision(statsData.output.bounty, precision, false),
          },
          {
            name: "Burnt",
            color: theme.yellow500,
            value: toPrecision(statsData.output.burnt, precision, false),
          },
          {
            name: "Transfer",
            color: theme.yellow500,
            value: toPrecision(statsData.output.transfer, precision, false),
          },
        ],
      });

      setTreasuryData({
        title: "Treasury",
        date: dayjs(dateLabels?.[index]).format("YYYY-MM-DD hh:mm"),
        icon: "solid",
        labels: [
          {
            name: "Balance",
            color: theme.orange500,
            value: toPrecision(statsData.treasuryBalance, precision, false),
          },
        ],
      });
    }
  }, [showIndex, statsHistory, dateLabels, precision, supportOpenGov, theme]);

  const sliceRangeData = (data) => {
    return data.slice(chartRange[0], chartRange[1] + 1);
  };

  const chartData = {
    dates: sliceRangeData(dateLabels),
    values: [
      {
        label: "Income",
        primaryColor: theme.pink300,
        secondaryColor: theme.pink100,
        data: sliceRangeData(incomeHistory),
        fill: true,
        icon: "square",
        order: 2,
      },
      {
        label: "Output",
        primaryColor: theme.yellow300,
        secondaryColor: theme.yellow100,
        data: sliceRangeData(outputHistory),
        fill: true,
        icon: "square",
        order: 1,
      },
      {
        label: "Treasury",
        primaryColor: theme.orange300,
        secondaryColor: theme.orange300,
        data: sliceRangeData(treasuryHistory),
        fill: false,
        icon: "bar",
        order: 0,
      },
    ],
  };

  const onHover = (index) => {
    if (index === undefined) {
      setShowIndex();
      return;
    }
    setShowIndex(index + chartRange[0]);
  };

  let chartComponent = null;

  if (dateLabels?.length > 0) {
    chartComponent = (
      <ChartAndSlider>
        <Chart data={chartData} onHover={onHover} />
        <SliderWrapper>
          <Slider
            min={0}
            max={dateLabels.length - 1 || 0}
            formatValue={(val) => dayjs(dateLabels[val]).format("YYYY-MM")}
            onChange={setChartRange}
          />
        </SliderWrapper>
      </ChartAndSlider>
    );
  }

  return (
    <CardWrapper>
      <Title>Total Stacked</Title>
      <ContentWrapper>
        <ListWrapper>
          <List data={incomeData}></List>
          <SecondListWrapper>
            <List data={outputData}></List>
            <List data={treasuryData}></List>
          </SecondListWrapper>
        </ListWrapper>
        {chartComponent}
      </ContentWrapper>
    </CardWrapper>
  );
};

export default TotalStacked;
