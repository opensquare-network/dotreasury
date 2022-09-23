import styled, { css } from "styled-components";
import { p_12_normal, p_14_medium } from "../../../../styles/text";
import {
  Primary_Theme_Pink_400,
  TEXT_DARK_DISABLE,
} from "../../../../constants";

// some vars from @uiw/react-heat-map
const TOP_PAD = 20;

const outline = css`
  outline: 2px solid rgba(0, 0, 0, 0.02);
  outline-offset: -2px;
`;

export const HeatMapWrapper = styled.div`
  display: flex;
  text-align: center;
  overflow: hidden;
  align-items: flex-end;
  flex-direction: column;

  rect {
    ${outline};

    &:hover {
      stroke: none !important;
      stroke-width: 0 !important;
    }

    &:active {
      fill: ${Primary_Theme_Pink_400} !important;
    }
  }
`;

export const ActivityCalendarContent = styled.div`
  display: flex;
  height: 135px;
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
  margin-right: 12px;
`;

export const ActivityCalendarWrapper = styled.div``;

export const LegendWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  ${p_14_medium};

  svg {
    margin-right: 12px;

    rect {
      ${outline};
    }
  }
`;

export const ActivityCalendarLegendWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;

  ${LegendWrapper} + ${LegendWrapper} {
    margin-left: 16px;
  }
`;
