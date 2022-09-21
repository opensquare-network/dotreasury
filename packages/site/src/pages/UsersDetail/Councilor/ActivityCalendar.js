// NOTE: hard code here
// - WIDTH
// - ONE_WEEK_COLUMN_WIDTH

import styled from "styled-components";
import HeatMap from "@uiw/react-heat-map";
import dayjs from "dayjs";
import {
  Greyscale_Grey_200,
  Primary_Theme_Pink_200,
  Primary_Theme_Pink_300,
  Primary_Theme_Pink_400,
  TEXT_DARK_DISABLE,
} from "../../../constants";
import { p_12_normal } from "../../../styles/text";

// some vars from @uiw/react-heat-map
const TOP_PAD = 20;

const HeatMapWrapper = styled.div`
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

const ActivityCalendarWeekLabels = styled.ul`
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
const ActivityCalendarWeekLabelsWrapper = styled.div`
  margin-right: 18px;
`;

const ActivityCalendarWrapper = styled.div`
  display: flex;
  height: 135px;
`;

export default function ActivityCalendar({ value, ...props }) {
  const rectSize = 12;
  const rectSpace = 4;

  const WIDTH = 1920;
  const ONE_WEEK_COLUMN_WIDTH = rectSize + rectSpace + 0.2;

  const currentDate = dayjs();
  const offsetDate = dayjs(currentDate).subtract(
    Math.floor(WIDTH / ONE_WEEK_COLUMN_WIDTH),
    "week"
  );

  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <ActivityCalendarWrapper>
      <ActivityCalendarWeekLabelsWrapper>
        <ActivityCalendarWeekLabels>
          {weekLabels.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ActivityCalendarWeekLabels>
      </ActivityCalendarWeekLabelsWrapper>

      <HeatMapWrapper>
        <HeatMap
          width={WIDTH}
          rectSize={rectSize}
          space={rectSpace}
          rectProps={{
            rx: 2,
            ry: 2,
          }}
          legendCellSize={0}
          panelColors={{
            0: Greyscale_Grey_200,
            2: Primary_Theme_Pink_200,
            3: Primary_Theme_Pink_300,
            4: Primary_Theme_Pink_400,
          }}
          {...props}
          value={value}
          startDate={offsetDate.toDate()}
          endDate={currentDate.toDate()}
          weekLabels={false}
        />
      </HeatMapWrapper>
    </ActivityCalendarWrapper>
  );
}
