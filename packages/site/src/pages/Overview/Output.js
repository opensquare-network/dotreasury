import React, { useState, useEffect } from "react";

import DoughnutCard from "./DoughnutCard";
import {
  OVERVIEW_PROPOSALS_COLOR,
  OVERVIEW_TIPS_COLOR,
  OVERVIEW_BOUNTIES_COLOR,
  OVERVIEW_BURNT_COLOR,
} from "../../constants";
import DoughnutCardLinkTitle from "./DoughnutCardLinkTitle";
import { useIsKusamaChain } from "../../utils/hooks/chain";
import { useSelector } from "react-redux";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import { getPrecision, toPrecision } from "../../utils";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { sumBy } from "../../utils/math";

const Output = () => {
  const overview = useSelector(overviewSelector);
  const isKusama = useIsKusamaChain();
  const symbol = useSelector(chainSymbolSelector);

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
        ...(isKusama
          ? {
              children: [
                {
                  name: "OpenGov",
                },
              ],
            }
          : null),
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
          color: OVERVIEW_PROPOSALS_COLOR,
          ...(isKusama
            ? {
                children: [
                  {
                    name: "OpenGov",
                    color: OVERVIEW_PROPOSALS_COLOR,
                    iconColor: "transparent",
                    iconDisabledColor: "transparent",
                    value: openGovSpent,
                    fiatValue: openGovSpentFiatValue,
                  },
                ],
              }
            : null),
        },
        {
          name: "Tips",
          value: tipSpent,
          fiatValue: tipSpentFiatValue,
          color: OVERVIEW_TIPS_COLOR,
        },
        {
          name: "Bounties",
          value: bountySpent,
          fiatValue: bountySpentFiatValue,
          color: OVERVIEW_BOUNTIES_COLOR,
        },
        {
          name: "Burnt",
          value: burntTotal,
          color: OVERVIEW_BURNT_COLOR,
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
    isKusama,
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
    />
  );
};

export default Output;
