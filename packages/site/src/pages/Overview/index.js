import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import "../../components/Charts/globalConfig";

import Summary from "./Summary";
import ProposerTable from "./ProposerTable";
import BeneficiaryTable from "./BeneficiaryTable";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import { getPrecision, toPrecision } from "../../utils";
import TotalStacked from "./TotalStacked";
import Income from "./Income";
import Output from "./Output";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { useChainRoute } from "../../utils/hooks";
import { gap_x, gap_y, grid_cols } from "../../styles/tailwindcss";
import { breakpoint } from "../../styles/responsive";
import OpenGovSpend from "./OpenGovSpend";
import { useIsKusamaChain } from "../../utils/hooks/chain";

const DoughnutWrapper = styled.div`
  display: grid;
  margin-bottom: 24px;
  ${gap_x(16)};
  ${gap_y(24)};
  ${grid_cols(3)};

  ${breakpoint(950, grid_cols(1))};
`;

const TableWrapper = styled.div`
  margin-top: 24px;
  display: grid;
  gap: 24px;
  @media screen and (min-width: 556px) {
    grid-template-columns: repeat(auto-fit, minmax(556px, 1fr));
  }
  @media screen and (max-width: 556px) {
    grid-template-columns: repeat(auto-fill);
  }
`;

const Overview = () => {
  const overview = useSelector(overviewSelector);
  const symbol = useSelector(chainSymbolSelector);
  const isKusama = useIsKusamaChain();

  useChainRoute();

  const precision = getPrecision(symbol);

  const bountySpent = toPrecision(
    overview.output.bounty || 0,
    precision,
    false
  );
  const proposalSpent = toPrecision(
    overview.output.proposal || 0,
    precision,
    false
  );
  const tipSpent = toPrecision(overview.output.tip || 0, precision, false);
  const burntTotal = toPrecision(overview.output.burnt || 0, precision, false);

  const inflation = toPrecision(
    overview.income.inflation || 0,
    precision,
    false
  );
  const slashTreasury = toPrecision(
    overview.income.slashSeats.treasury || 0,
    precision,
    false
  );
  const slashDemocracy = toPrecision(
    overview.income.slashSeats.democracy || 0,
    precision,
    false
  );
  const slashStaking = toPrecision(
    overview.income.slashSeats.staking || 0,
    precision,
    false
  );
  const slashElection = toPrecision(
    overview.income.slashSeats.electionsPhragmen || 0,
    precision,
    false
  );
  const slashIdentity = toPrecision(
    overview.income.slashSeats.identity || 0,
    precision,
    false
  );
  const slashReferenda = toPrecision(
    overview.income.slashSeats.referenda || 0,
    precision,
    false
  );
  const slashFellowshipReferenda = toPrecision(
    overview.income.slashSeats.fellowshipReferenda || 0,
    precision,
    false
  );
  const others = toPrecision(overview.income.others || 0, precision, false);

  return (
    <>
      <Summary />
      <DoughnutWrapper>
        <Income
          inflation={inflation}
          slashTreasury={slashTreasury}
          slashDemocracy={slashDemocracy}
          slashStaking={slashStaking}
          slashElection={slashElection}
          slashIdentity={slashIdentity}
          slashReferenda={slashReferenda}
          slashFellowshipReferenda={slashFellowshipReferenda}
          others={others}
        />
        <Output
          proposals={proposalSpent}
          tips={tipSpent}
          bounties={bountySpent}
          burnt={burntTotal}
        />

        {isKusama && <OpenGovSpend data={overview?.openGovSpend} />}
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
