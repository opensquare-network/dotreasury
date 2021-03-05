import React, { useState, useEffect } from "react";

import DoughnutCard from "./DoughnutCard";
import {
  OVERVIEW_PROPOSALS_COLOR,
  OVERVIEW_TIPS_COLOR,
  OVERVIEW_BOUNTIES_COLOR,
  OVERVIEW_BURNT_COLOR,
} from "../../constants";

const Output = ({ proposals, tips, bounties, burnt }) => {
  const [outputData, setOutputData] = useState({
    icon: "circle",
    labels: [],
  });

  const [outputStatus, setOutputStatus] = useState({
    labels: [
      {
        name: "Proposals",
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
          color: OVERVIEW_PROPOSALS_COLOR,
        },
        {
          name: "Tips",
          value: tips,
          color: OVERVIEW_TIPS_COLOR,
        },
        {
          name: "Bounties",
          value: bounties,
          color: OVERVIEW_BOUNTIES_COLOR,
        },
        {
          name: "Burnt",
          value: burnt,
          color: OVERVIEW_BURNT_COLOR,
        },
      ],
    });
  }, [proposals, tips, bounties, burnt]);

  const clickEvent = (name) => {
    const obj = Object.assign({}, outputStatus);
    obj.labels.forEach((item) => {
      if (item.name === name) {
        const disabled = !item.disabled;
        item.disabled = disabled;
      }
    });
    setOutputStatus(obj);
  };

  return (
    <DoughnutCard
      title="Output"
      data={outputData}
      status={outputStatus}
      clickEvent={clickEvent}
    />
  );
};

export default Output;
