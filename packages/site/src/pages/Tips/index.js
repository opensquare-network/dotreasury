import React from "react";
import styled from "styled-components";

import TipsTable from "./TipsTable";

const Header = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 44px;
  color: #1d253c;
  margin-bottom: 20px;
`;

const Tips = () => {
  const testData = [
    {
      beneficiary: {
        name: "FtvpME…nZXKLg",
      },
      finder: {
        name: "DbJSgP…tbQ66r",
      },
      reason: "https://kusama.polkassembly.io/post/346",
      balance: {
        value: "50.00",
      },
      status: {
        status: "Closed",
        time: "12h 34min ago",
      },
    },
    {
      beneficiary: {
        name: "FtvpME…nZXKLg",
      },
      finder: {
        name: "Eleanor",
      },
      reason: "My second video about Kusama Network",
      balance: {
        value: "3.50",
      },
      status: {
        status: "Tipping (2)",
      },
    },
  ];

  return (
    <>
      <Header>Tips</Header>
      <TipsTable data={testData} />
    </>
  );
};

export default Tips;
