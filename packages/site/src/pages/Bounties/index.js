import React from "react";
import styled from "styled-components";

import Title from "../../components/Title";
import ResponsivePagination from "../../components/ResponsivePagination";
import BountiesTable from "./BountiesTable";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const Bounties = () => {
  const testData = [
    {
      creator: "Gfazop6biSFdPJtCxGeVyJzTYprB1Us77Lx8Jww51fyTq5a",
      beneficiary: "Gfazop6biSFdPJtCxGeVyJzTYprB1Us77Lx8Jww51fyTq5a",
      title: "Kusama network UI Bounty",
      update: {
        time: "29 d 23 h",
        blocks: 51767899
      },
      payout: "-",
      value: 1000000000000,
      status: "Active"
    },
    {
      creator: "Gfazop6biSFdPJtCxGeVyJzTYprB1Us77Lx8Jww51fyTq5a",
      beneficiary: "Gfazop6biSFdPJtCxGeVyJzTYprB1Us77Lx8Jww51fyTq5a",
      title: "Kusama network UI Bounty",
      update: {
        time: "29 d 23 h",
        blocks: 51767899
      },
      payout: "-",
      value: 1000000000000,
      status: "Active"
    }
  ]

  return (
    <>
      <Header>Bounties</Header>
      <BountiesTable data={testData} />
      <ResponsivePagination
        activePage={1}
        totalPages={3} />
    </>
  );
};

export default Bounties;
