import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import dayjs from "dayjs";
import { useTheme } from "../../../context/theme";

import Text from "../../../components/Text";
import Card from "../../../components/Card";
import ListOrigin from "../CustomList";
import Chart from "./Chart";
import ValueChart from "./ValueChart";
import { getPrecision, toPrecision } from "../../../utils";

import {
  fetchStatsHistory,
  statsHistorySelector,
} from "../../../store/reducers/overviewSlice";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import { h4_16_semibold, p_12_normal } from "../../../styles/text";
import {
  justify_between,
  space_y,
  w,
  w_full,
} from "../../../styles/tailwindcss";
import { breakpoint, smcss } from "../../../styles/responsive";
import Slider from "../../../components/Slider";
import { currentChainSettings, isCentrifuge } from "../../../utils/chains";
import BigNumber from "bignumber.js";

const Wrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  ${smcss(css`
    flex-direction: column;
  `)}
`;

const ChartCardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

const CardWrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const Title = styled(Text)`
  margin-bottom: 16px;
  ${h4_16_semibold};
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
  overflow: auto;
`;

const List = styled(ListOrigin)`
  ${w(276)};
  ${breakpoint(600, w_full)};
`;
const ListWrapper = styled.div`
  ${space_y(24)};
`;

const TotalStacked = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [dateLabels, setDateLabels] = useState([]);
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [outputHistory, setOutputHistory] = useState([]);
  const [treasuryHistory, setTreasuryHistory] = useState([]);
  const [fiatHistory, setFiatHistory] = useState([]);
  const [showIndex, setShowIndex] = useState();
  const [statsChartRange, setStatsChartRange] = useState([0, 0]);
  const [valueChartRange, setValueChartRange] = useState([0, 0]);
  const [incomeData, setIncomeData] = useState({
    title: "Income",
    icon: "square",
    labels: [
      !isCentrifuge
        ? {
            name: "Inflation",
            value: 0,
          }
        : {
            name: "Block Reward",
            value: 0,
          },
      {
        name: "Slashes",
        children: [
          currentChainSettings.hasStaking && {
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
          ...(currentChainSettings.supportOpenGov
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
        ].filter(Boolean),
      },
      {
        name: "Others",
        value: 0,
      },
    ].filter(Boolean),
  });
  const [outputData, setOutputData] = useState({
    title: "Output",
    icon: "square",
    labels: [
      {
        name: "Proposal",
        value: 0,
      },
      ...(currentChainSettings.hasTips
        ? [
            {
              name: "Tips",
              value: 0,
            },
          ]
        : []),
      ...(currentChainSettings.hasBounties
        ? [
            {
              name: "Bounties",
              value: 0,
            },
          ]
        : []),
      ...(currentChainSettings.hasBurnt
        ? [
            {
              name: "Burnt",
              value: 0,
            },
          ]
        : []),
      ...(currentChainSettings.hasTransfers
        ? [
            {
              name: "Transfer",
              value: 0,
            },
          ]
        : []),
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
    setStatsChartRange([0, dateLabels.length - 1]);

    const incomeHistory = statsHistory.map((statsItem) => {
      return (
        toPrecision(statsItem.income.inflation, precision, false) +
        toPrecision(statsItem.income.slash, precision, false) +
        toPrecision(statsItem.income.transfer, precision, false) +
        toPrecision(statsItem.income.others, precision, false) +
        toPrecision(
          statsItem.income?.centrifugeBlockReward || 0,
          precision,
          false,
        ) +
        toPrecision(statsItem.income?.centrifugeTxFee || 0, precision, false)
      );
    });
    setIncomeHistory(incomeHistory);

    const outputHistory = statsHistory.map((statsItem) => {
      return (
        toPrecision(statsItem.output.tip, precision, false) +
        toPrecision(statsItem.output.proposal, precision, false) +
        toPrecision(statsItem.output.bounty, precision, false) +
        toPrecision(statsItem.output.burnt, precision, false) +
        toPrecision(statsItem.output.transfer, precision, false)
      );
    });
    setOutputHistory(outputHistory);

    const treasuryHistory = statsHistory.map((statsItem) =>
      toPrecision(statsItem.treasuryBalance, precision, false),
    );
    setTreasuryHistory(treasuryHistory);

    const fiatHistory = statsHistory.map((statsItem) => {
      return BigNumber(toPrecision(statsItem.treasuryBalance, precision))
        .times(statsItem.price)
        .toNumber();
    });
    setFiatHistory(fiatHistory);
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
          !isCentrifuge
            ? {
                name: "Inflation",
                color: theme.pink500,
                value: toPrecision(
                  statsData.income.inflation,
                  precision,
                  false,
                ),
              }
            : {
                name: "Block Reward",
                color: theme.pink500,
                value: toPrecision(
                  statsData.income.centrifugeBlockReward,
                  precision,
                  false,
                ),
              },
          {
            name: "Slashes",
            color: theme.pink500,
            children: [
              currentChainSettings.hasStaking && {
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
              ...(currentChainSettings.supportOpenGov
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
            ].filter(Boolean),
          },
          isCentrifuge && {
            name: "Gas Fee",
            color: theme.purple500,
            value: toPrecision(
              statsData.income.centrifugeTxFee,
              precision,
              false,
            ),
          },
          {
            name: "Others",
            color: theme.pink500,
            value: toPrecision(statsData.income.others, precision, false),
          },
        ].filter(Boolean),
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
          ...(currentChainSettings.hasTips
            ? [
                {
                  name: "Tips",
                  color: theme.yellow500,
                  value: toPrecision(statsData.output.tip, precision, false),
                },
              ]
            : []),
          ...(currentChainSettings.hasBounties
            ? [
                {
                  name: "Bounties",
                  color: theme.yellow500,
                  value: toPrecision(statsData.output.bounty, precision, false),
                },
              ]
            : []),
          ...(currentChainSettings.hasBurnt
            ? [
                {
                  name: "Burnt",
                  color: theme.yellow500,
                  value: toPrecision(statsData.output.burnt, precision, false),
                },
              ]
            : []),
          ...(currentChainSettings.hasTransfers
            ? [
                {
                  name: "Transfer",
                  color: theme.yellow500,
                  value: toPrecision(
                    statsData.output.transfer,
                    precision,
                    false,
                  ),
                },
              ]
            : []),
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
  }, [showIndex, statsHistory, dateLabels, precision, theme]);

  const sliceStatsRangeData = (data) => {
    return data.slice(statsChartRange[0], statsChartRange[1] + 1);
  };

  const sliceValueRangeData = (data) => {
    return data.slice(valueChartRange[0], valueChartRange[1] + 1);
  };

  const statsChartData = {
    dates: sliceStatsRangeData(dateLabels),
    values: [
      {
        label: "Income",
        primaryColor: theme.pink300,
        secondaryColor: theme.pink100,
        data: sliceStatsRangeData(incomeHistory),
        fill: true,
        icon: "square",
        order: 2,
      },
      {
        label: "Output",
        primaryColor: theme.yellow300,
        secondaryColor: theme.yellow100,
        data: sliceStatsRangeData(outputHistory),
        fill: true,
        icon: "square",
        order: 1,
      },
      {
        label: "Treasury",
        primaryColor: theme.orange300,
        secondaryColor: theme.orange300,
        data: sliceStatsRangeData(treasuryHistory),
        fill: false,
        icon: "bar",
        order: 0,
      },
    ],
  };

  const valueChartData = {
    dates: sliceValueRangeData(dateLabels),
    values: [
      {
        label: "DOT Amount",
        primaryColor: theme.pink300,
        data: sliceValueRangeData(treasuryHistory),
        icon: "square",
        fill: false,
        yAxisID: "dot",
      },
      {
        label: "USD Value",
        primaryColor: theme.green300,
        data: sliceValueRangeData(fiatHistory),
        icon: "square",
        fill: false,
        yAxisID: "usd",
      },
    ],
  };

  const onHover = (index) => {
    if (index === undefined) {
      setShowIndex();
      return;
    }
    setShowIndex(index + statsChartRange[0]);
  };

  let statsChartComponent = null;
  let valueChartComponent = null;

  if (dateLabels?.length > 0) {
    statsChartComponent = (
      <ChartAndSlider>
        <Chart
          data={statsChartData}
          onHover={onHover}
          yStepSize={
            currentChainSettings.ui?.totalStacked?.yStepSize || 8000000
          }
        />
        <SliderWrapper>
          <Slider
            min={0}
            max={dateLabels.length - 1 || 0}
            formatValue={(val) => dayjs(dateLabels[val]).format("YYYY-MM")}
            onChange={setStatsChartRange}
          />
        </SliderWrapper>
      </ChartAndSlider>
    );

    valueChartComponent = (
      <ChartAndSlider>
        <ValueChart
          data={valueChartData}
          yStepSize={
            currentChainSettings.ui?.totalStacked?.yStepSize || 8000000
          }
        />
        <SliderWrapper>
          <Slider
            min={0}
            max={dateLabels.length - 1 || 0}
            formatValue={(val) => {
              return dayjs(dateLabels[val]).format("YYYY-MM");
            }}
            onChange={setValueChartRange}
          />
        </SliderWrapper>
      </ChartAndSlider>
    );
  }

  return (
    <Wrapper>
      <div>
        <CardWrapper>
          <Title>Treasury Stats</Title>
          <ListWrapper>
            <List symbol={symbol} data={incomeData}></List>
            <List symbol={symbol} data={outputData}></List>
            <List symbol={symbol} data={treasuryData}></List>
          </ListWrapper>
        </CardWrapper>
      </div>

      <ChartCardsWrapper>
        <CardWrapper>
          <Title>Treasury Stats Chart</Title>
          {statsChartComponent}
        </CardWrapper>

        <CardWrapper>
          <Title>Treasury Value Chart</Title>
          {valueChartComponent}
        </CardWrapper>
      </ChartCardsWrapper>
    </Wrapper>
  );
};

export default TotalStacked;
