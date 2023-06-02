import React from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
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
import {
  flex_col,
  flex_row_reverse,
  gap_x,
  gap_y,
  grid_cols,
  m_t,
} from "../../styles/tailwindcss";
import OpenGovSpend from "./OpenGovSpend";
import { useIsKusamaChain } from "../../utils/hooks/chain";
import { mdcss, smcss } from "@osn/common";
import SpendPeriod from "./SpendPeriod";

const DoughnutWrapper = styled.div`
  display: grid;
  margin-bottom: 16px;
  ${gap_x(16)};
  ${gap_y(16)};

  ${(p) => grid_cols(p.count)};
  ${(p) => {
    if (p.count < 3) {
      return css`
        .overview-base-chart-card-content-group {
          ${flex_row_reverse};
        }
      `;
    } else if (p.count >= 3) {
      return css`
        ${mdcss(`
          .overview-base-chart-card-content-group {
            ${flex_row_reverse};
          }
        `)}
      `;
    }
  }}

  ${mdcss(grid_cols(1))};
  ${mdcss(`
    .overview-base-chart-card-content-group-chart {
      ${m_t(8)};
    }
  `)}
  ${smcss(`
    .overview-base-chart-card-content-group {
      ${flex_col};
    }
  `)}
`;

const TableWrapper = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 16px;
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

  const inflation = toPrecision(
    overview.income.inflation || 0,
    precision,
    false,
  );
  const slashTreasury = toPrecision(
    overview.income.slashSeats.treasury || 0,
    precision,
    false,
  );
  const slashDemocracy = toPrecision(
    overview.income.slashSeats.democracy || 0,
    precision,
    false,
  );
  const slashStaking = toPrecision(
    overview.income.slashSeats.staking || 0,
    precision,
    false,
  );
  const slashElection = toPrecision(
    overview.income.slashSeats.electionsPhragmen || 0,
    precision,
    false,
  );
  const slashIdentity = toPrecision(
    overview.income.slashSeats.identity || 0,
    precision,
    false,
  );
  const slashReferenda = toPrecision(
    overview.income.slashSeats.referenda || 0,
    precision,
    false,
  );
  const slashFellowshipReferenda = toPrecision(
    overview.income.slashSeats.fellowshipReferenda || 0,
    precision,
    false,
  );
  const others = toPrecision(overview.income.others || 0, precision, false);

  const cards = [
    <Income
      key="income"
      inflation={inflation}
      slashTreasury={slashTreasury}
      slashDemocracy={slashDemocracy}
      slashStaking={slashStaking}
      slashElection={slashElection}
      slashIdentity={slashIdentity}
      slashReferenda={slashReferenda}
      slashFellowshipReferenda={slashFellowshipReferenda}
      others={others}
    />,
    <Output key="output" />,

    isKusama && <OpenGovSpend key="openGovSpend" />,
  ].filter(Boolean);

  return (
    <>
      <Summary />
      <DoughnutWrapper count={cards.length}>{cards}</DoughnutWrapper>
      <TotalStacked />
      <SpendPeriod />
      <TableWrapper>
        <BeneficiaryTable />
        <ProposerTable />
      </TableWrapper>
    </>
  );
};

export default Overview;
