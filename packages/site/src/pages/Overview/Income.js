import React, { useState, useEffect } from "react";

import DoughnutCard from "./DoughnutCard";
import {
  OVERVIEW_INFLATION_COLOR,
  OVERVIEW_TREASURY_COLOR,
  OVERVIEW_STAKING_COLOR,
  OVERVIEW_DEMOCRACY_COLOR,
  OVERVIEW_ELECTION_COLOR,
  OVERVIEW_IDENTITY_COLOR,
  OVERVIEW_OTHERS_COLOR,
} from "../../constants";

const Income = ({
  inflation,
  slashTreasury,
  slashDemocracy,
  slashStaking,
  slashElection,
  slashIdentity,
  others,
}) => {
  const [incomeData, setIncomeData] = useState({
    icon: "circle",
    labels: [],
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
              name: "Treasury",
              value: slashTreasury,
              color: OVERVIEW_TREASURY_COLOR,
            },
            {
              name: "Staking",
              value: slashStaking,
              color: OVERVIEW_STAKING_COLOR,
            },
            {
              name: "Democracy",
              value: slashDemocracy,
              color: OVERVIEW_DEMOCRACY_COLOR,
            },
            {
              name: "Election",
              value: slashElection,
              color: OVERVIEW_ELECTION_COLOR,
            },
            {
              name: "Identity",
              value: slashIdentity,
              color: OVERVIEW_IDENTITY_COLOR,
            },
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
    others,
  ]);

  const clickEvent = (name) => {
    const obj = Object.assign({}, incomeData);
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
    setIncomeData(obj);
  };

  return (
    <DoughnutCard title="Income" data={incomeData} clickEvent={clickEvent} />
  );
};

export default Income;
