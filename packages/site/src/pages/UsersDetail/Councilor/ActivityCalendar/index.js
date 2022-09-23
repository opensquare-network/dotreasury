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
  PopperContent,
  PopperContentCount,
  PopperContentDate,
} from "./styled";
import { useRef } from "react";
import { useState } from "react";
import Popper from "../Popper";
import { usePopper } from "../../../../components/Popper/usePopper";

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

  const [triggerRef, setTriggerRefFn] = useState({ current: null });
  const setTriggerRef = (el) => setTriggerRefFn({ current: el });
  const popperRef = useRef(null);

  const [popperData, setPopperData] = useState({});

  const {
    popperVisible,
    hidePopper,
    showPopper: showPopperFn,
  } = usePopper({
    refRef: triggerRef,
    popperRef: popperRef,
    showTooltip: true,
    offset: [0, 12],
  });

  function showPopper(e, data) {
    setTriggerRef(e.target);
    showPopperFn();
    setPopperData(data);
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
                onMouseEnter={(e) => showPopper(e, data)}
                onFocus={(e) => showPopper(e, data)}
                onMouseLeave={hidePopper}
                onBlur={hidePopper}
              />
            )}
          />
        </HeatMapWrapper>
      </ActivityCalendarContent>

      <ActivityCalendarLegendWrapper>
        <Legend fill={Primary_Theme_Pink_200}>Active</Legend>
        <Legend fill={Greyscale_Grey_200}>Inactive</Legend>
      </ActivityCalendarLegendWrapper>

      <Popper ref={popperRef} visible={popperVisible}>
        <PopperContent>
          <PopperContentCount>
            Count: {popperData.count || 0}
          </PopperContentCount>
          <PopperContentDate>
            {dayjs(popperData.meta?.indexer?.blockTime).format(
              "YYYY-MM-DD HH:mm:ss"
            )}
          </PopperContentDate>
        </PopperContent>
      </Popper>
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
