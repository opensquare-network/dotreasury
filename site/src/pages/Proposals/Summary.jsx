import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import { mrgap } from "../../styles";
import useFiatPrice from "../../hooks/useFiatPrice";

import {
  fetchProposalsSummary,
  proposalSummarySelector,
} from "../../store/reducers/proposalSlice";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import {
  fetchTreasury,
  treasurySelector,
} from "../../store/reducers/burntSlice";
import { abbreviateBigNumber } from "../../utils";
import {
  flex_1,
  gap_x,
  gap_y,
  grid,
  grid_cols,
} from "../../styles/tailwindcss";
import { h3_18_semibold, p_12_normal } from "../../styles/text";
import SummaryItem from "../../components/Summary/Item";
import { lgcss, smcss } from "../../styles/responsive";
import SummaryOngoingItemWrapper from "../../components/Summary/OngoingItemWrapper";
import SummaryProposalsWrapper from "../../components/Summary/ProposalsWrapper";
import { SpendPeriodItem } from "../Overview/Summary";
import KusamaSpendPeriod from "../Overview/kusamaSummary/treasuryDetail/spendPeriod";
import { isKusama } from "../../utils/chains";

const ItemsWrapper = styled.div`
  ${flex_1};
  ${grid};
  ${grid_cols("auto-fit", 210)};
  ${gap_x(128)};
  ${gap_y(16)};

  ${lgcss(gap_x(64))};
  ${smcss(grid_cols(2))}
`;

const Value = styled(Text)`
  ${h3_18_semibold};
`;

const Unit = styled(TextMinor)`
  ${h3_18_semibold};
  color: var(--textTertiary);
`;

const ValueInfo = styled(Text)`
  ${p_12_normal};
  color: var(--textTertiary);
`;
const ValueWrapper = styled.div`
  display: flex;
  ${h3_18_semibold};
  ${css`
    ${mrgap("4px")}
  `}
`;

const Summary = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProposalsSummary());
    dispatch(fetchTreasury());
  }, [dispatch]);

  const summary = useSelector(proposalSummarySelector);
  const treasury = useSelector(treasurySelector);
  const symbol = useSelector(chainSymbolSelector);
  const { price: symbolPrice } = useFiatPrice();

  return (
    <SummaryProposalsWrapper>
      <SummaryOngoingItemWrapper>
        <SummaryItem
          title="Ongoing"
          content={<Value>{summary.numOfOngoing}</Value>}
        />
      </SummaryOngoingItemWrapper>

      <ItemsWrapper>
        <SummaryItem
          title="Approved"
          content={<Value>{summary.numOfApproved}</Value>}
        />
        <SummaryItem
          title="Awarded"
          content={<Value>{summary.numOfAwarded}</Value>}
        />
        <SummaryItem title="Total" content={<Value>{summary.total}</Value>} />

        <SummaryItem
          title="Available"
          content={
            <div>
              <ValueWrapper>
                <Value>{abbreviateBigNumber(treasury.free)}</Value>
                <Unit>{symbol}</Unit>
              </ValueWrapper>
              <ValueInfo>
                {!!treasury.free && "≈ "}$
                {abbreviateBigNumber(treasury.free * symbolPrice)}
              </ValueInfo>
            </div>
          }
        />
        <SummaryItem
          title="Next burn"
          style={{ alignItems: "flex-start" }}
          content={
            <ValueWrapper>
              <Value>
                {abbreviateBigNumber(treasury.burnPercent * treasury.free)}
              </Value>
              <Unit>{symbol}</Unit>
            </ValueWrapper>
          }
        />
        {isKusama ? <KusamaSpendPeriod /> : <SpendPeriodItem />}
      </ItemsWrapper>
    </SummaryProposalsWrapper>
  );
};

export default Summary;
