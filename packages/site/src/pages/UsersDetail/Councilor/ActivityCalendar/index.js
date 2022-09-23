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
  TooltipContent,
  TooltipContentCount,
  TooltipContentDate,
} from "./styled";
import { useRef } from "react";
import { useState } from "react";
import {
  TooltipContainer,
  TooltipArrow,
} from "../../../../components/Tooltip/styled";
import { showTooltip } from "../../../../components/Tooltip/utils";

export default function ActivityCalendar({ value, ...props }) {
  const rectSize = 12;
  const rectSpace = 4;

  // NOTE: reduce heatmap width will increase performance
  const WIDTH = 1237;
  const ONE_WEEK_COLUMN_WIDTH = rectSize + rectSpace + 0.1;

  const currentDate = dayjs();
  const offsetDate = dayjs(currentDate).subtract(
    Math.floor(WIDTH / ONE_WEEK_COLUMN_WIDTH),
    "week"
  );

  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const popperRef = useRef(null);

  const [popperData, setPopperData] = useState({});
  const [tooltipVisible, setTooltipVisible] = useState(false);

  function show(e, data) {
    showTooltip(e.target, popperRef.current, { offset: [0, 12] });
    setPopperData(data);
    setTooltipVisible(true);
  }

  function hide() {
    setTooltipVisible(false);
  }

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
            rectRender={(props, data) => (
              <rect
                {...props}
                onMouseEnter={(e) => show(e, data)}
                onFocus={(e) => show(e, data)}
                onMouseLeave={hide}
                onBlur={hide}
              />
            )}
          />
        </HeatMapWrapper>
      </ActivityCalendarContent>

      <ActivityCalendarLegendWrapper>
        <Legend fill={Primary_Theme_Pink_200}>Active</Legend>
        <Legend fill={Greyscale_Grey_200}>Inactive</Legend>
      </ActivityCalendarLegendWrapper>

      <TooltipContainer ref={popperRef} data-show={tooltipVisible}>
        <TooltipContent>
          <TooltipContentCount>
            Count: {popperData.count || 0}
          </TooltipContentCount>
          <TooltipContentDate>
            {dayjs(popperData.meta?.indexer?.blockTime).format(
              "YYYY-MM-DD HH:mm:ss"
            )}
          </TooltipContentDate>
        </TooltipContent>
        <TooltipArrow data-popper-arrow />
      </TooltipContainer>
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
