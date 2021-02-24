import React from "react";

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
  const incomeData = {
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
  }

  return (
    <DoughnutCard data={incomeData} />
  )
}

export default Income;
