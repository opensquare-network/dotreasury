import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { defaults } from "react-chartjs-2";

import Title from "../../components/Title";
import Summary from "./Summary";
import ProposerTable from "./ProposerTable";
import BeneficiaryTable from "./BeneficiaryTable";
// import OutputDoughnutCard from "./OutputDoughnutCard";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import { getPrecision, toPrecision } from "../../utils";
import TotalStacked from "./TotalStacked";
import Income from "./Income";
import Output from "./Output";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const DoughnutWrapper = styled.div`
  display: grid;
  gap: 24px;
  margin-bottom: 24px;
  @media screen and (min-width: 556px) {
    grid-template-columns: repeat(auto-fit, minmax(556px, 1fr));
  }
  @media screen and (max-width: 556px) {
    grid-template-columns: repeat(1fr);
  }
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
  const symbol = useSelector(chainSymbolSelector);

  const bountySpent = toPrecision(overview.output.bounty || 0, getPrecision(symbol), false);
  const proposalSpent = toPrecision(overview.output.proposal || 0, getPrecision(symbol), false);
  const tipSpent = toPrecision(overview.output.tip || 0, getPrecision(symbol), false);
  const burntTotal = toPrecision(overview.output.burnt || 0, getPrecision(symbol), false);

  const inflation = toPrecision(overview.income.inflation || 0, getPrecision(symbol), false);
  const slashTreasury = toPrecision(
    overview.income.slashSeats.treasury || 0,
    getPrecision(symbol),
    false
  );
  const slashDemocracy = toPrecision(
    overview.income.slashSeats.democracy || 0,
    getPrecision(symbol),
    false
  );
  const slashStaking = toPrecision(
    overview.income.slashSeats.staking || 0,
    getPrecision(symbol),
    false
  );
  const slashElection = toPrecision(
    overview.income.slashSeats.electionsPhragmen || 0,
    getPrecision(symbol),
    false
  );
  const slashIdentity = toPrecision(
    overview.income.slashSeats.identity || 0,
    getPrecision(symbol),
    false
  );
  const others = toPrecision(overview.income.others || 0, getPrecision(symbol), false);

  defaults.global.defaultFontFamily = "Inter";

  return (
    <>
      <Header>Overview</Header>
      <Summary />
      <DoughnutWrapper>
        <Income
          inflation={inflation}
          slashTreasury={slashTreasury}
          slashDemocracy={slashDemocracy}
          slashStaking={slashStaking}
          slashElection={slashElection}
          slashIdentity={slashIdentity}
          others={others}
        />
        <Output
          proposals={proposalSpent}
          tips={tipSpent}
          bounties={bountySpent}
          burnt={burntTotal}
        />
      </DoughnutWrapper>
      <TotalStacked />
      <TableWrapper>
        <BeneficiaryTable />
        <ProposerTable />
      </TableWrapper>
    </>
  );
};

export default Overview;
