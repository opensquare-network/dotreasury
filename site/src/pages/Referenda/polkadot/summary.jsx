import React, { useMemo } from "react";
import styled from "styled-components";
import Text from "../../../components/Text";
import { h3_18_semibold } from "../../../styles/text";
import {
  flex_1,
  gap_x,
  gap_y,
  grid,
  grid_cols,
} from "../../../styles/tailwindcss";
import SummaryItem from "../../../components/Summary/Item";
import { lgcss, smcss } from "../../../styles/responsive";
import SummaryOngoingItemWrapper from "../../../components/Summary/OngoingItemWrapper";
import SummaryReferendaWrapper from "../../../components/Summary/ReferendaWrapper";
import useFetchSummary from "./hooks/useFetchSummary";
import SkeletonBar from "../../../components/skeleton/bar";

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

const DISPLAY_ITEMS = [
  "treasurer",
  "small_tipper",
  "big_tipper",
  "small_spender",
  "medium_spender",
  "big_spender",
];

function formatToTitleCase(str) {
  if (!str) {
    return "";
  }

  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function LoadableContent({ children, isLoading }) {
  return <>{isLoading ? <SkeletonBar width={114} height={28} /> : children}</>;
}

export default function ReferendaSummary() {
  const { data: rawSummary, isLoading } = useFetchSummary();

  const applicationSummary = Array.isArray(rawSummary) ? rawSummary : [];

  const filteredData = useMemo(() => {
    return applicationSummary.filter((item) =>
      DISPLAY_ITEMS.includes(item?.name),
    );
  }, [applicationSummary]);

  const activeCount = useMemo(() => {
    return filteredData.reduce(
      (sum, item) => sum + (item?.activeCount || 0),
      0,
    );
  }, [filteredData]);

  return (
    <SummaryReferendaWrapper>
      {/* Ongoing Summary */}
      <SummaryOngoingItemWrapper>
        <SummaryItem
          title="Ongoing"
          content={
            <LoadableContent isLoading={isLoading}>
              <Value>{activeCount || 0}</Value>
            </LoadableContent>
          }
        />
      </SummaryOngoingItemWrapper>

      <ItemsWrapper>
        {filteredData.map((item) => (
          <SummaryItem
            key={item.id}
            title={formatToTitleCase(item.name)}
            content={
              <LoadableContent isLoading={isLoading}>
                <Value>
                  {item?.activeCount || 0}
                  <span className="light"> / {item?.total || 0}</span>
                </Value>
              </LoadableContent>
            }
          />
        ))}
      </ItemsWrapper>
    </SummaryReferendaWrapper>
  );
}
