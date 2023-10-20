/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from "react";
import { useTheme } from "../../context/theme";
import { useState } from "react";
import { CHAIN_SETTINGS } from "../../utils/chains";

export function useIncomePeriodsLegends() {
  const theme = useTheme();
  const colors = {
    Inflation: theme.pink500,
    Slashes: theme.pink400,
    Transfers: theme.pink300,
    "Big Others": theme.pink200,
  };

  const [incomeLegends, setIncomeLegends] = useState([
    {
      label: "Inflation",
      color: colors["Inflation"],
      enabled: true,
      getValue: (period) => 0 - period.totalInflationValue,
    },
    {
      label: "Slashes",
      color: colors["Slashes"],
      enabled: true,
      getValue: (period) => 0 - period.totalSlashesValue,
    },
    {
      label: "Transfers",
      color: colors["Transfers"],
      enabled: true,
      getValue: (period) => 0 - period.totalTransfersValue,
    },
    {
      label: "Big Others",
      color: colors["Big Others"],
      enabled: true,
      getValue: (period) => 0 - period.totalBigOthersValue,
    },
  ]);

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
      CHAIN_SETTINGS.hasTips && {
        label: "Tips",
        color: colors["Tips"],
        enabled: true,
        getValue: (period) => period.totalTipsValue,
        getCount: (period) => period.tips.length,
        getFiat: (period) => period.totalTipsFiat,
      },
      CHAIN_SETTINGS.hasBounties && {
        label: "Bounties",
        color: colors["Bounties"],
        enabled: true,
        getValue: (period) => period.totalBountiesValue,
        getCount: (period) => period.bounties.length,
        getFiat: (period) => period.totalBountiesFiat,
      },
      CHAIN_SETTINGS.hasBurnt && {
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
