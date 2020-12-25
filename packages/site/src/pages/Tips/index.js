import React from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import TipsTable from "./TipsTable";
import Pagination from "../../components/Pagination";
import Title from "../../components/Title";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const LoadingWrapper = styled.div`
  background: white;
  height: 100px;
  display: flex;
  align-item: center;
  justify-content: center;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-top: 0;
  border-bottom-left-radius: 0.285rem;
  border-bottom-right-radius: 0.285rem;
`;

const Tips = () => {
  const loading = false;
  const testData = [
    {
      beneficiary: {
        name: "Eleanor",
        address: "HUfzjs5WNDNJfbP5kPUBpneAizE5yCprsX",
      },
      finder: {
        address: "HUfzjs5WNDNJfbP5kPUBpneAizE5yCprsX",
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
        address: "HUfzjs5WNDNJfbP5kPUBpneAizE5yCprsX",
      },
      finder: {
        name: "Eleanor",
        address: "HUfzjs5WNDNJfbP5kPUBpneAizE5yCprsX",
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
      {loading && (
        <LoadingWrapper>
          <Image src={"./imgs/loading.svg"} />
        </LoadingWrapper>
      )}
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
