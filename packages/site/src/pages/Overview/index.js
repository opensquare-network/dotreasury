import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Title from "../../components/Title";
import Summary from "./Summary";
import ProposerTable from "./ProposerTable";
import BeneficiaryTable from "./BeneficiaryTable";
import DoughnutCard from "./DoughnutCard";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import { toPrecision } from "../../utils";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const TableWrapper = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 24px;
  @media screen and (min-width: 556px) {
    grid-template-columns: repeat(auto-fit, minmax(556px, 1fr));
  }
  @media screen and (max-width: 556px) {
    grid-template-columns: repeat(1fr);
  }
`;

const Overview = () => {
  const overview = useSelector(overviewSelector);
  const bountySpent = toPrecision(overview.output.bounty || 0, 12, false);
  const proposalSpent = toPrecision(overview.output.proposal || 0, 12, false);
  const tipSpent = toPrecision(overview.output.tip || 0, 12, false);
  const burntTotal = toPrecision(overview.output.burnt || 0, 12, false);

  return (
    <>
      <Header>Overview</Header>
      <Summary />
      <DoughnutCard
        proposals={proposalSpent}
        tips={tipSpent}
        bounties={bountySpent}
        burnt={burntTotal}
      />
      <TableWrapper>
        <BeneficiaryTable />
        <ProposerTable />
      </TableWrapper>
    </>
  );
};

export default Overview;
