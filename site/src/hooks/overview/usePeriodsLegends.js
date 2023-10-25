/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from "react";
import { useTheme } from "../../context/theme";
import { useState } from "react";
import { currentChainSettings, isCentrifuge } from "../../utils/chains";

export function useIncomePeriodsLegends() {
  const theme = useTheme();
  const colors = {
    Inflation: theme.pink500,
    Slashes: theme.pink400,
    Transfers: theme.pink300,
    "Big Others": theme.pink200,
    Others: theme.pink200,
    // centrifuge
    "Block Rewards": theme.pink500,
    "Gas Fee": theme.pink300,
  };

  const [incomeLegends, setIncomeLegends] = useState(
    [
      !isCentrifuge
        ? {
            label: "Inflation",
            color: colors["Inflation"],
            enabled: true,
            getValue: (period) => 0 - period.totalInflationValue,
          }
        : {
            label: "Block Rewards",
            color: colors["Block Rewards"],
            enabled: true,
            getValue: (period) => 0 - period.totalCentrifugeBlockRewardValue,
          },
      {
        label: "Slashes",
        color: colors["Slashes"],
        enabled: true,
        getValue: (period) => 0 - period.totalSlashesValue,
      },
      currentChainSettings.hasTransfers && {
        label: "Transfers",
        color: colors["Transfers"],
        enabled: true,
        getValue: (period) => 0 - period.totalTransfersValue,
      },
      isCentrifuge && {
        label: "Gas Fee",
        color: colors["Gas Fee"],
        enabled: true,
        getValue: (period) => 0 - period.totalCentrifugeTxFeeValue,
      },
      !isCentrifuge
        ? {
            label: "Big Others",
            color: colors["Big Others"],
            enabled: true,
            getValue: (period) => 0 - period.totalBigOthersValue,
          }
        : {
            label: "Others",
            color: colors.Others,
            enabled: true,
            getValue: (period) => 0 - period.totalOthersValue,
          },
    ].filter(Boolean),
  );

  useEffect(() => {
    setIncomeLegends((legends) =>
      legends.map((legend) => ({
        ...legend,
        color: colors[legend.label],
      })),
    );
  }, [theme]);

  return [incomeLegends, setIncomeLegends];
}

export function useOutputPeriodsLegends() {
  const theme = useTheme();
  const colors = {
    Proposals: theme.yellow500,
    Tips: theme.yellow400,
    Bounties: theme.yellow300,
    Burnt: theme.yellow200,
  };

  const [outputLegends, setOutputLegends] = useState(
    [
      {
        label: "Proposals",
        color: colors["Proposals"],
        enabled: true,
        getValue: (period) => period.totalProposalsValue,
        getCount: (period) => period.proposals.length,
        getFiat: (period) => period.totalProposalsFiat,
      },
      currentChainSettings.hasTips && {
        label: "Tips",
        color: colors["Tips"],
        enabled: true,
        getValue: (period) => period.totalTipsValue,
        getCount: (period) => period.tips.length,
        getFiat: (period) => period.totalTipsFiat,
      },
      currentChainSettings.hasBounties && {
        label: "Bounties",
        color: colors["Bounties"],
        enabled: true,
        getValue: (period) => period.totalBountiesValue,
        getCount: (period) => period.bounties.length,
        getFiat: (period) => period.totalBountiesFiat,
      },
      currentChainSettings.hasBurnt && {
        label: "Burnt",
        color: colors["Burnt"],
        enabled: true,
        getValue: (period) => period.totalBurntValue,
        getCount: (period) => period.burnt.length,
        getFiat: (period) => period.totalBurntFiat,
      },
    ].filter(Boolean),
  );

  useEffect(() => {
    setOutputLegends((legends) =>
      legends.map((legend) => ({
        ...legend,
        color: colors[legend.label],
      })),
    );
  }, [theme]);

  return [outputLegends, setOutputLegends];
}

export function useOutputSinglePeriodsLegends() {
  const theme = useTheme();
  const colors = {
    Proposals: theme.pink300,
    Tips: theme.yellow300,
    Bounties: theme.purple300,
    Burnt: theme.orange300,
  };

  const [origLegends] = useOutputPeriodsLegends();

  const [outputLegends, setOutputLegends] = useState(
    origLegends.map((legend) => {
      return {
        ...legend,
        color: colors[legend.label],
      };
    }),
  );

  useEffect(() => {
    setOutputLegends((legends) =>
      legends.map((legend) => ({
        ...legend,
        color: colors[legend.label],
      })),
    );
  }, [theme]);

  return [outputLegends, setOutputLegends];
}
