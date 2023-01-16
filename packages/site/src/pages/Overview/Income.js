import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GrayImage from "../../components/GrayImage";
import { NavLink } from "react-router-dom";

import DoughnutCard from "./DoughnutCard";
import TextMinor from "../../components/TextMinor";
import {
  OVERVIEW_INFLATION_COLOR,
  OVERVIEW_TREASURY_COLOR,
  OVERVIEW_STAKING_COLOR,
  OVERVIEW_DEMOCRACY_COLOR,
  OVERVIEW_ELECTION_COLOR,
  OVERVIEW_IDENTITY_COLOR,
  OVERVIEW_OTHERS_COLOR,
  TEXT_DARK_MAJOR,
} from "../../constants";
import { useSelector } from "react-redux";
import {
  chainSelector,
  chainSymbolSelector,
} from "../../store/reducers/chainSlice";
import DoughnutCardLinkTitle from "./DoughnutCardLinkTitle";

const LinkButton = styled(TextMinor)`
  display: flex;
  position: absolute;
  right: 24px;
  top: 20px;
  :hover {
    color: ${TEXT_DARK_MAJOR};
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
  const chain = useSelector(chainSelector);
  const isKusama = chain === "kusama";
  const symbol = useSelector(chainSymbolSelector)?.toLowerCase();
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
          ...(isKusama
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
          color: OVERVIEW_INFLATION_COLOR,
        },
        {
          name: "Slashes",
          children: [
            {
              name: "Staking",
              value: slashStaking,
              color: OVERVIEW_STAKING_COLOR,
            },
            {
              name: "Treasury",
              value: slashTreasury,
              color: OVERVIEW_TREASURY_COLOR,
            },
            {
              name: "Election",
              value: slashElection,
              color: OVERVIEW_ELECTION_COLOR,
            },
            {
              name: "Democracy",
              value: slashDemocracy,
              color: OVERVIEW_DEMOCRACY_COLOR,
            },
            {
              name: "Identity",
              value: slashIdentity,
              color: OVERVIEW_IDENTITY_COLOR,
            },
            ...(isKusama
              ? [
                  {
                    name: "Referenda",
                    value: slashReferenda,
                    color: OVERVIEW_DEMOCRACY_COLOR,
                  },
                  {
                    name: "Fellowship",
                    value: slashFellowshipReferenda,
                    color: OVERVIEW_IDENTITY_COLOR,
                  },
                ]
              : []),
          ],
        },
        {
          name: "Others",
          value: others,
          color: OVERVIEW_OTHERS_COLOR,
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
    isKusama,
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
      data={incomeData}
      status={incomeStatus}
      clickEvent={clickEvent}
    >
      <NavLink to={`/${symbol}/income`}>
        <LinkButton>
          Detail
          <GrayImage src="/imgs/caret-right.svg" width={24} />
        </LinkButton>
      </NavLink>
    </DoughnutCard>
  );
};

export default Income;
