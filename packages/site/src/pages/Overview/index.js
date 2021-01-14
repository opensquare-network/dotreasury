import React from "react";
import styled from "styled-components";
import Title from "../../components/Title";
import Summary from "./Summary";
import ProposerTable from "./ProposerTable";
import BeneficiaryTable from "./BeneficiaryTable";
import DoughnutCard from "./DoughnutCard";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const TableWrapper = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 32px;
  @media screen and (min-width: 556px) {
    grid-template-columns: repeat(auto-fit, minmax(556px, 1fr));
  }
  @media screen and (max-width: 556px) {
    grid-template-columns: repeat(1fr);
  }
`;

const Overview = () => {
  return (
    <>
      <Header>Overview</Header>
      <Summary />
      <DoughnutCard proposals={1} tips={1.1} bounties={1.2} />
      <TableWrapper>
        <BeneficiaryTable />
        <ProposerTable />
      </TableWrapper>
    </>
  );
};

export default Overview;
