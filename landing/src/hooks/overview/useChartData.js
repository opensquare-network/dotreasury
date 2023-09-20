import { useTheme } from "../../../../site/src/context/theme";
import { getPrecision, toPrecision } from "../../../../site/src/utils";
import { useState, useEffect } from "react";
import { getChainSettings } from "../../utils/chains";
import { sumBy } from "../../../../site/src/utils/math";
import { createChartStatusToggleClickEvent } from "../../utils/chart/statusToggleClickEvent";
import { useOverviewData } from "../useData";

export function useOverviewIncomeChartData(chain = "") {
  const theme = useTheme();
  const { symbol } = getChainSettings(chain);
  const precision = getPrecision(symbol);

  const overview = useOverviewData(chain);

  const inflation = toPrecision(
    overview.income.inflation || 0,
    precision,
    false,
  );
  const slashes = toPrecision(
    Number(overview.income.slashSeats.treasury || 0) +
      Number(overview.income.slashSeats.democracy || 0) +
      Number(overview.income.slashSeats.staking || 0) +
      Number(overview.income.slashSeats.electionsPhragmen || 0) +
      Number(overview.income.slashSeats.identity || 0) +
      Number(overview.income.slashSeats.referenda || 0) +
      Number(overview.income.slashSeats.fellowshipReferenda || 0),
    precision,
    false,
  );
  const others = toPrecision(overview.income.others || 0, precision, false);

  const [incomeData, setIncomeData] = useState({
    icon: "circle",
    labels: [],
  });
  const [incomeStatus, setIncomeStatus] = useState({
    labels: [
      {
        name: "Inflation",
      },
      {
        name: "Slashes",
      },
      {
        name: "Others",
      },
    ],
  });

  useEffect(() => {
    setIncomeData({
      icon: "circle",
      labels: [
        {
          name: "Inflation",
          value: inflation,
          color: theme.pink500,
        },
        {
          name: "Slashes",
          value: slashes,
          color: theme.yellow500,
        },
        {
          name: "Others",
          value: others,
          color: theme.neutral500,
        },
      ],
    });
  }, [inflation, slashes, others, theme]);

  const clickEvent = createChartStatusToggleClickEvent(
    incomeStatus,
    setIncomeStatus,
  );

  return {
    incomeData,
    incomeStatus,
    clickEvent,
  };
}

export function useOverviewOutputChartData(chain) {
  const theme = useTheme();
  const { symbol } = getChainSettings(chain);
  const precision = getPrecision(symbol);

  const overview = useOverviewData(chain);

  const referendaSpent = overview.output?.referendaSpent ?? {};

  const proposalSpent = toPrecision(
    overview.output.proposal.value || 0,
    precision,
    false,
  );
  const openGovSpent = sumBy(Object.values(referendaSpent), (item) => {
    return toPrecision(item.value, precision, false);
  });
  const tipSpent = toPrecision(
    overview.output.tip.value || 0,
    precision,
    false,
  );
  const bountySpent = toPrecision(
    overview.output.bounty.value || 0,
    precision,
    false,
  );
  const burntTotal = toPrecision(
    overview.output.burnt.value || 0,
    precision,
    false,
  );

  const proposalFiatValue = overview.output.proposal.fiatValue;
  const openGovSpentFiatValue = sumBy(Object.values(referendaSpent), (item) => {
    return item.fiatValue;
  });
  const tipSpentFiatValue = overview.output.tip.fiatValue;
  const bountySpentFiatValue = overview.output.bounty.fiatValue;

  const [outputData, setOutputData] = useState({
    icon: "circle",
    labels: [],
  });
  const [outputStatus, setOutputStatus] = useState({
    labels: [
      {
        name: "Proposals",
      },
      {
        name: "Tips",
      },
      {
        name: "Bounties",
      },
      {
        name: "Burnt",
      },
    ],
  });

  useEffect(() => {
    setOutputData({
      icon: "circle",
      labels: [
        {
          name: "Proposals",
          value: proposalSpent,
          fiatValue: proposalFiatValue,
          color: theme.pink500,
        },
        {
          name: "Tips",
          value: tipSpent,
          fiatValue: tipSpentFiatValue,
          color: theme.yellow500,
        },
        {
          name: "Bounties",
          value: bountySpent,
          fiatValue: bountySpentFiatValue,
          color: theme.purple500,
        },
        {
          name: "Burnt",
          value: burntTotal,
          color: theme.orange500,
        },
      ],
    });
  }, [
    proposalSpent,
    proposalFiatValue,
    openGovSpent,
    openGovSpentFiatValue,
    tipSpent,
    tipSpentFiatValue,
    bountySpent,
    bountySpentFiatValue,
    burntTotal,
    theme,
  ]);

  const clickEvent = createChartStatusToggleClickEvent(
    outputStatus,
    setOutputStatus,
  );

  return {
    outputData,
    outputStatus,
    clickEvent,
  };
}
