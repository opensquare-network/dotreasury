import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

import DoughnutCard from "./DoughnutCard";
import TextMinor from "../../components/TextMinor";

import DoughnutCardLinkTitle from "./DoughnutCardLinkTitle";
import { useTheme } from "../../context/theme";
import IconMask from "../../components/Icon/Mask";
import { items_center } from "../../styles/tailwindcss";
import { useSupportOpenGov } from "../../utils/hooks/chain";

const LinkButton = styled(TextMinor)`
  display: flex;
  ${items_center};
  :hover {
    color: var(--textPrimary);
    & > :last-child {
      -webkit-filter: grayscale(0);
      filter: grayscale(0);
      opacity: 1;
    }
  }
`;

const Income = ({
  inflation,
  slashTreasury,
  slashDemocracy,
  slashStaking,
  slashElection,
  slashIdentity,
  slashReferenda,
  slashFellowshipReferenda,
  others,
}) => {
  const theme = useTheme();
  const supportOpenGov = useSupportOpenGov();
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
        children: [
          {
            name: "Staking",
          },
          {
            name: "Treasury",
          },
          {
            name: "Election",
          },
          {
            name: "Democracy",
          },
          {
            name: "Identity",
          },
          ...(supportOpenGov
            ? [
                {
                  name: "Referenda",
                },
                {
                  name: "Fellowship",
                },
              ]
            : []),
        ],
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
          children: [
            {
              name: "Staking",
              value: slashStaking,
              color: theme.yellow400,
            },
            {
              name: "Treasury",
              value: slashTreasury,
              color: theme.yellow500,
            },
            {
              name: "Election",
              value: slashElection,
              color: theme.yellow200,
            },
            {
              name: "Democracy",
              value: slashDemocracy,
              color: theme.yellow300,
            },
            {
              name: "Identity",
              value: slashIdentity,
              color: theme.yellow100,
            },
            ...(supportOpenGov
              ? [
                  {
                    name: "Referenda",
                    value: slashReferenda,
                    color: theme.yellow100,
                  },
                  {
                    name: "Fellowship",
                    value: slashFellowshipReferenda,
                    color: theme.yellow100,
                  },
                ]
              : []),
          ],
        },
        {
          name: "Others",
          value: others,
          color: theme.neutral500,
        },
      ],
    });
  }, [
    inflation,
    slashTreasury,
    slashDemocracy,
    slashStaking,
    slashElection,
    slashIdentity,
    slashReferenda,
    slashFellowshipReferenda,
    others,
    supportOpenGov,
    theme,
  ]);

  const clickEvent = (name) => {
    const obj = Object.assign({}, incomeStatus);
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
    setIncomeStatus(obj);
  };

  return (
    <DoughnutCard
      title={
        <DoughnutCardLinkTitle href="https://wiki.polkadot.network/docs/learn-treasury#funding-the-treasury">
          Income
        </DoughnutCardLinkTitle>
      }
      titleExtra={
        <NavLink to={"/income"}>
          <LinkButton>
            Detail
            <IconMask
              src="/imgs/caret-right.svg"
              size={20}
              color="textSecondary"
            />
          </LinkButton>
        </NavLink>
      }
      data={incomeData}
      status={incomeStatus}
      clickEvent={clickEvent}
      symbol={symbol}
    />
  );
};

export default Income;
