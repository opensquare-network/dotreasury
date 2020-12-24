import React from "react";
import styled from "styled-components";

import TipsTable from "./TipsTable";
import Pagination from "../../components/Pagination";
import Title from "../../components/Title";

const Header = styled(Title)`
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
      <Pagination
        boundaryRange={0}
        defaultActivePage={1}
        ellipsisItem={null}
        firstItem={null}
        lastItem={null}
        siblingRange={1}
        totalPages={3}
      />
    </>
  );
};

export default Tips;
