import React, { useState, useEffect } from "react";

import DoughnutCard from "./DoughnutCard";
import DoughnutCardLinkTitle from "./DoughnutCardLinkTitle";
import { useSupportOpenGov } from "../../utils/hooks/chain";
import { useSelector } from "react-redux";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import { getPrecision, toPrecision } from "../../utils";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { sumBy } from "../../utils/math";
import { useTheme } from "../../context/theme";
import { currentChainSettings } from "../../utils/chains";

const Output = () => {
  const overview = useSelector(overviewSelector);
  const supportOpenGov = useSupportOpenGov();
  const symbol = useSelector(chainSymbolSelector);
  const theme = useTheme();

  const referendaSpent = overview.output?.referendaSpent ?? {};
  const precision = getPrecision(symbol);

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
        ...(supportOpenGov
          ? {
              children: [
                {
                  name: "OpenGov",
                },
              ],
            }
          : null),
      },
      ...(currentChainSettings.hasTips ? [{ name: "Tips" }] : []),
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
          ...(supportOpenGov
            ? {
                children: [
                  {
                    name: "OpenGov",
                    color: theme.pink500,
                    iconColor: "transparent",
                    iconDisabledColor: "transparent",
                    value: openGovSpent,
                    fiatValue: openGovSpentFiatValue,
                  },
                ],
              }
            : null),
        },
        ...(currentChainSettings.hasTips
          ? [
              {
                name: "Tips",
                value: tipSpent,
                fiatValue: tipSpentFiatValue,
                color: theme.yellow500,
              },
            ]
          : []),
        ...(currentChainSettings.hasBounties
          ? [
              {
                name: "Bounties",
                value: bountySpent,
                fiatValue: bountySpentFiatValue,
                color: theme.purple500,
              },
            ]
          : []),
        ...(currentChainSettings.hasBurnt
          ? [
              {
                name: "Burnt",
                value: burntTotal,
                color: theme.orange500,
              },
            ]
          : []),
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
    supportOpenGov,
    theme,
  ]);

  const clickEvent = (name) => {
    const obj = Object.assign({}, outputStatus);
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
    setOutputStatus(obj);
  };

  return (
    <DoughnutCard
      title={
        <DoughnutCardLinkTitle href="https://wiki.polkadot.network/docs/learn-treasury#creating-a-treasury-proposal">
          Output
        </DoughnutCardLinkTitle>
      }
      data={outputData}
      status={outputStatus}
      clickEvent={clickEvent}
      symbol={symbol}
    />
  );
};

export default Output;
