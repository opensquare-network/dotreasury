import React, { useState } from "react";

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

const Income = () => {
  const [incomeData, setIncomeData] = useState({
    icon: "circle",
    labels: [
      {
        name: "Inflation",
        value: 64706,
        color: OVERVIEW_INFLATION_COLOR
      },
      {
        name: "Slashes",
        children: [
          {
            name: "Treasury",
            value: 11153,
            color: OVERVIEW_TREASURY_COLOR
          },
          {
            name: "Staking",
            value: 11253,
            color: OVERVIEW_STAKING_COLOR
          },
          {
            name: "Democracy",
            value: 11353,
            color: OVERVIEW_DEMOCRACY_COLOR
          },
          {
            name: "Election",
            value: 1153,
            color: OVERVIEW_ELECTION_COLOR
          },
          {
            name: "Identity",
            value: 1153,
            color: OVERVIEW_IDENTITY_COLOR
          },
        ]
      },
      {
        name: "Others",
        value: 1165,
        color: OVERVIEW_OTHERS_COLOR
      },
    ]
  });

  const clickEvent = (name) => {
    console.log(name)
    const obj = Object.assign({}, incomeData);
    obj.labels.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          if (child.name === name) {
            child.disabled = !child.disabled;
          }
        })
      } else if (item.name === name) {
        item.disabled = !item.disabled;
      }
    });
    setIncomeData(obj);
  }

  return (
    <DoughnutCard data={incomeData} clickEvent={clickEvent} />
  )
}

export default Income;
