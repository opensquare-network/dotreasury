import React from "react";
import styled from "styled-components";
import Card from "../../components/Card";
import List from "./CustomList";
import { breakpoint } from "../../styles/responsive";
import {
  flex,
  flex_col,
  gap,
  h,
  items_center,
  justify_between,
  justify_center,
  p_24,
  relative,
  rounded_none,
  w_full,
} from "../../styles/tailwindcss";
import { h4_16_semibold } from "../../styles/text";

const CardWrapper = styled(Card)`
  ${relative};
  ${flex};
  ${flex_col};
  ${gap(24)};
  ${p_24};

  ${breakpoint(600, rounded_none)};
`;

const ChartWrapper = styled.div`
  ${flex};
  ${justify_center};
  ${w_full};
  ${h(216)};
`;

const Title = styled.h3`
  ${h4_16_semibold};
  margin: 0;
  color: var(--textPrimary);
`;
const TitleGroup = styled.div`
  ${flex};
  ${items_center};
  ${justify_between};
`;

const ContentGroup = styled.div`
  ${flex};
  ${flex_col};
  ${gap(24)};
`;

export default function OverviewBaseChartCard({
  title,
  titleExtra,
  data,
  status,
  clickEvent,
  chart,
  children,
  symbol,
}) {
  return (
    <CardWrapper className="overview-base-chart-card">
      <TitleGroup>
        <Title>{title}</Title>
        {titleExtra}
      </TitleGroup>

      <ContentGroup className="overview-base-chart-card-content-group">
        <ChartWrapper className="overview-base-chart-card-content-group-chart">
          {chart}
        </ChartWrapper>
        <List
          symbol={symbol}
          data={data}
          status={status}
          clickEvent={clickEvent}
        />
      </ContentGroup>
      {children}
    </CardWrapper>
  );
}
