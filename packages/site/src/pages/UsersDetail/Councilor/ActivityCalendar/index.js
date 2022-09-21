// NOTE: hard code here
// - WIDTH
// - ONE_WEEK_COLUMN_WIDTH

import HeatMap from "@uiw/react-heat-map";
import dayjs from "dayjs";
import {
  Greyscale_Grey_200,
  Primary_Theme_Pink_200,
  Primary_Theme_Pink_300,
  Primary_Theme_Pink_400,
} from "../../../../constants";

import {
  ActivityCalendarWrapper,
  ActivityCalendarWeekLabelsWrapper,
  ActivityCalendarWeekLabels,
  HeatMapWrapper,
  ActivityCalendarContent,
  ActivityCalendarLegendWrapper,
  LegendWrapper,
} from "./styled";

export default function ActivityCalendar({ value, ...props }) {
  const rectSize = 12;
  const rectSpace = 4;

  const WIDTH = 1909;
  const ONE_WEEK_COLUMN_WIDTH = rectSize + rectSpace + 0.1;

  const currentDate = dayjs();
  const offsetDate = dayjs(currentDate).subtract(
    Math.floor(WIDTH / ONE_WEEK_COLUMN_WIDTH),
    "week"
  );

  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <ActivityCalendarWrapper>
      <ActivityCalendarContent>
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
      </ActivityCalendarContent>

      <ActivityCalendarLegendWrapper>
        <Legend fill={Primary_Theme_Pink_200}>Active</Legend>
        <Legend fill={Greyscale_Grey_200}>Inactive</Legend>
      </ActivityCalendarLegendWrapper>
    </ActivityCalendarWrapper>
  );
}

function Legend({ fill, children }) {
  return (
    <LegendWrapper>
      <svg width="10" height="10">
        <rect width="10" height="10" rx="2" ry="2" fill={fill} />
      </svg>
      <span>{children}</span>
    </LegendWrapper>
  );
}
