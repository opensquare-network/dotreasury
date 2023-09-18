import { useTheme } from "../../../../site/src/context/theme";
import { getPrecision, toPrecision } from "../../../../site/src/utils";
import { DOT_OVERVIEW_DATA, KSM_OVERVIEW_DATA } from "../../fixtures";
import { useState, useEffect } from "react";
import { getChainSettings } from "../../utils/chains";
import { sumBy } from "../../../../site/src/utils/math";

// FIXME: landing, overview data from server
const OVERVIEW_DATA = {
  polkadot: DOT_OVERVIEW_DATA,
  kusama: KSM_OVERVIEW_DATA,
};

export function useTreasuryOverviewIncomeChartData(chain = "") {
  const theme = useTheme();
  const { symbol } = getChainSettings(chain);
  const precision = getPrecision(symbol);

  const overview = OVERVIEW_DATA[chain];

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

  const clickEvent = createChartListClickEvent(incomeStatus, setIncomeStatus);

  return {
    incomeData,
    incomeStatus,
    clickEvent,
  };
}

export function useTreasuryOverviewOutputChartData(chain) {
  const theme = useTheme();
  const { symbol } = getChainSettings(chain);
  const precision = getPrecision(symbol);

  const overview = OVERVIEW_DATA[chain];

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

  const clickEvent = createChartListClickEvent(outputStatus, setOutputStatus);

  return {
    outputData,
    outputStatus,
    clickEvent,
  };
}

function createChartListClickEvent(status, set) {
  const clickEvent = (name) => {
    const obj = Object.assign({}, status);
    obj.labels.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (child.name === name) {
            child.disabled = !child.disabled;
          }
        });
        if (item.children.every((item) => item.disabled)) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      }
      if (item.name === name) {
        const disabled = !item.disabled;
        item.disabled = disabled;
        if (item.children) {
          item.children.forEach((child) => {
            child.disabled = disabled;
          });
        }
      }
    });
    set(obj);
  };

  return clickEvent;
}
