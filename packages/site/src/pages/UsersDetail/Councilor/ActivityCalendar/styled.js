import styled from "styled-components";
import { p_12_normal } from "../../../../styles/text";
import {
  Primary_Theme_Pink_400,
  TEXT_DARK_DISABLE,
} from "../../../../constants";

// some vars from @uiw/react-heat-map
const TOP_PAD = 20;

export const HeatMapWrapper = styled.div`
  display: flex;
  text-align: center;
  overflow: hidden;
  align-items: flex-end;
  flex-direction: column;

  rect {
    outline: 2px solid rgb(0 0 0 / 0.02);
    outline-offset: -2px;

    &:hover {
      stroke: none !important;
      stroke-width: 0 !important;
    }

    &:active {
      fill: ${Primary_Theme_Pink_400} !important;
    }
  }
`;

export const ActivityCalendarWeekLabels = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: ${TOP_PAD}px !important;

  li {
    color: ${TEXT_DARK_DISABLE};
    ${p_12_normal};
    line-height: 12px;
    margin-top: 4px !important;

    &:first-child {
      margin-top: 0 !important;
    }
  }
`;

export const ActivityCalendarWeekLabelsWrapper = styled.div`
  margin-right: 18px;
`;

export const ActivityCalendarWrapper = styled.div`
  display: flex;
  height: 135px;
`;
