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

const Output = ({ proposals, tips, bounties, burnt }) => {
  const isKusama = useIsKusamaChain();

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
          value: proposals,
          fiatValue: proposals,
          color: OVERVIEW_PROPOSALS_COLOR,
          ...(isKusama
            ? {
                children: [
                  {
                    name: "OpenGov",
                    color: OVERVIEW_PROPOSALS_COLOR,
                    iconColor: "transparent",
                    iconDisabledColor: "transparent",
                    value: proposals,
                    fiatValue: proposals,
                  },
                ],
              }
            : null),
        },
        {
          name: "Tips",
          value: tips,
          fiatValue: tips,
          color: OVERVIEW_TIPS_COLOR,
        },
        {
          name: "Bounties",
          value: bounties,
          fiatValue: bounties,
          color: OVERVIEW_BOUNTIES_COLOR,
        },
        {
          name: "Burnt",
          value: burnt,
          fiatValue: burnt,
          color: OVERVIEW_BURNT_COLOR,
        },
      ],
    });
  }, [proposals, tips, bounties, burnt, isKusama]);

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
