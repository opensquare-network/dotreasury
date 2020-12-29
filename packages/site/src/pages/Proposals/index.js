import React from "react";
import styled from "styled-components";

import Title from "../../components/Title";
import ResponsivePagination from "../../components/ResponsivePagination";
import ProposalsTable from "./ProposalsTable";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const Proposals = () => {
  const testData = [
    {
      beneficiary: "Gfazop6biSFdPJtCxGeVyJzTYprB1Us77Lx8Jww51fyTq5a",
      proposalBy: "Gfazop6biSFdPJtCxGeVyJzTYprB1Us77Lx8Jww51fyTq5a",
      proposalId: "1",
      time: "2020-12-12 09:43:41",
      value: 1000000000000,
      status: "Proposed"
    },
    {
      beneficiary: "Gfazop6biSFdPJtCxGeVyJzTYprB1Us77Lx8Jww51fyTq5a",
      proposalBy: "Gfazop6biSFdPJtCxGeVyJzTYprB1Us77Lx8Jww51fyTq5a",
      proposalId: "2",
      time: "2020-12-12 09:43:41",
      value: 1000000000000,
      status: "Proposed"
    },
  ]

  return (
    <>
      <Header>Proposals</Header>
      <ProposalsTable data={testData} />
      <ResponsivePagination
        activePage={1}
        totalPages={3} />
    </>
  );
};

export default Proposals;
