import React from "react";
import styled from "styled-components";
import Card from "../../components/Card";
import Text from "../../components/Text";
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
  ${h(216)};
`;

const Title = styled(Text)`
  ${h4_16_semibold};
`;
const TitleGroup = styled.div`
  ${flex};
  ${items_center};
  ${justify_between};
`;

export default function OverviewBaseChartCard({
  title,
  titleExtra,
  data,
  status,
  clickEvent,
  chart,
  children,
}) {
  return (
    <CardWrapper>
      <TitleGroup>
        <Title>{title}</Title>
        {titleExtra}
      </TitleGroup>

      <ChartWrapper>{chart}</ChartWrapper>

      <List data={data} status={status} clickEvent={clickEvent} />

      {children}
    </CardWrapper>
  );
}
