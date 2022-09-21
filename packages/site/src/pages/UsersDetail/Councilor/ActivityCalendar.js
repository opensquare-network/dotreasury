// NOTE: hard code here
// - ONE_YEAR_DAYS_WIDTH
// - ONE_WEEK_COLUMN_WIDTH

import styled, { css } from "styled-components";
import HeatMap from "@uiw/react-heat-map";
import dayjs from "dayjs";
import {
  Greyscale_Grey_200,
  Primary_Theme_Pink_200,
  Primary_Theme_Pink_300,
  Primary_Theme_Pink_400,
} from "../../../constants";

const HeatMapWrapper = styled.div`
  display: flex;
  text-align: center;
  overflow: hidden;
  align-items: flex-end;
  flex-direction: column;

  ${(p) => css`
    max-wdith: ${p.maxWidth}px;
  `}

  rect {
    outline: 2px solid rgb(0 0 0 / 0.02);
    outline-offset: -2px;

    &:hover {
      stroke: none !important;
      stroke-width: 0 !important;
    }

    &:active {
      fill: none !important;
    }
  }
`;

const ActivityCalendarWeekLabels = styled.div`
  margin-right: 8px;
`;

const ActivityCalendarWrapper = styled.div`
  display: flex;
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

  return (
    <ActivityCalendarWrapper max-width={WIDTH}>
      <ActivityCalendarWeekLabels>week</ActivityCalendarWeekLabels>

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
