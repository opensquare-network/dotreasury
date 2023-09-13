import React, { useEffect, useMemo } from "react";
import styled from "styled-components";

import Text from "../../components/Text";
import {
  fetchApplicationSummary,
  applicationSummarySelector,
} from "../../store/reducers/openGovApplicationsSlice";
import { useDispatch, useSelector } from "react-redux";
import { sumBy } from "../../utils/math";
import { h3_18_semibold } from "../../styles/text";
import {
  flex_1,
  gap_x,
  gap_y,
  grid,
  grid_cols,
} from "../../styles/tailwindcss";
import SummaryItem from "../../components/Summary/Item";
import { lgcss, smcss } from "../../styles/responsive";
import SummaryOngoingItemWrapper from "../../components/Summary/OngoingItemWrapper";
import SummaryReferendaWrapper from "../../components/Summary/ReferendaWrapper";

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
  span.light {
    color: var(--textTertiary);
  }
`;

export default function Summary() {
  const dispatch = useDispatch();
  const applicationSummary = useSelector(applicationSummarySelector);

  useEffect(() => {
    dispatch(fetchApplicationSummary());
  }, [dispatch]);

  const activeCount = useMemo(() => {
    const {
      treasurer,
      small_tipper,
      big_tipper,
      small_spender,
      medium_spender,
      big_spender,
    } = applicationSummary ?? {};

    return sumBy(
      [
        treasurer,
        small_tipper,
        big_tipper,
        small_spender,
        medium_spender,
        big_spender,
      ],
      (item) => item?.active || 0,
    );
  }, [applicationSummary]);

  return (
    <SummaryReferendaWrapper>
      <SummaryOngoingItemWrapper>
        <SummaryItem
          title="Ongoing"
          content={<Value>{activeCount || 0}</Value>}
        />
      </SummaryOngoingItemWrapper>

      <ItemsWrapper>
        <SummaryItem
          title="Treasurer"
          content={
            <Value>
              {applicationSummary?.treasurer?.active || 0}
              <span className="light">
                {" "}
                / {applicationSummary?.treasurer?.total || 0}
              </span>
            </Value>
          }
        />
        <SummaryItem
          title="Small Tipper"
          content={
            <Value>
              {applicationSummary?.small_tipper?.active || 0}
              <span className="light">
                {" "}
                / {applicationSummary?.small_tipper?.total || 0}
              </span>
            </Value>
          }
        />
        <SummaryItem
          title="Big Tipper"
          content={
            <Value>
              {applicationSummary?.big_tipper?.active || 0}
              <span className="light">
                {" "}
                / {applicationSummary?.big_tipper?.total || 0}
              </span>
            </Value>
          }
        />
        <SummaryItem
          title="Small Spender"
          content={
            <Value>
              {applicationSummary?.small_spender?.active || 0}
              <span className="light">
                {" "}
                / {applicationSummary?.small_spender?.total || 0}
              </span>
            </Value>
          }
        />
        <SummaryItem
          title="Medium Spender"
          content={
            <Value>
              {applicationSummary?.medium_spender?.active || 0}
              <span className="light">
                {" "}
                / {applicationSummary?.medium_spender?.total || 0}
              </span>
            </Value>
          }
        />
        <SummaryItem
          title="Big Spender"
          content={
            <Value>
              {applicationSummary?.big_spender?.active || 0}
              <span className="light">
                {" "}
                / {applicationSummary?.big_spender?.total || 0}
              </span>
            </Value>
          }
        />
      </ItemsWrapper>
    </SummaryReferendaWrapper>
  );
}
