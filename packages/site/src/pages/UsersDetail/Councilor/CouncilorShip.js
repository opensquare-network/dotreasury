// NOTE: hard code here
// - ONE_YEAR_DAYS_WIDTH
// - ONE_WEEK_COLUMN_WIDTH

import styled, { css } from "styled-components";
import ActivityCalendar from "@uiw/react-heat-map";
import { CouncilorShipCardTitle, CouncilorShipCardWrapper } from "./styled";
import dayjs from "dayjs";
import { Greyscale_Grey_200, Primary_Theme_Pink_200 } from "../../../constants";

const ActivityCalendarWrapper = styled.div`
  display: flex;
`;

const ActivityCalendarWeekLabels = styled.div`
  margin-right: 8px;
`;

const ActivityCalendarContent = styled.div`
  display: flex;
  text-align: center;
  overflow: hidden;
  align-items: flex-end;
  flex-direction: column;

  ${(p) => css`
    max-wdith: ${p.maxWidth}px;
  `}
`;

export default function CouncilorShip() {
  // console.log(mock);

  const ONE_YEAR_DAYS_WIDTH = 1920;
  const ONE_WEEK_COLUMN_WIDTH = 14.2;

  const currentDate = dayjs();
  const offsetDate = dayjs(currentDate).subtract(
    Math.floor(ONE_YEAR_DAYS_WIDTH / ONE_WEEK_COLUMN_WIDTH),
    "week"
  );

  return (
    <CouncilorShipCardWrapper>
      <CouncilorShipCardTitle>Councilor Ship</CouncilorShipCardTitle>

      <ActivityCalendarWrapper>
        <ActivityCalendarWeekLabels>week</ActivityCalendarWeekLabels>

        <ActivityCalendarContent maxWidth={ONE_YEAR_DAYS_WIDTH}>
          <ActivityCalendar
            width={ONE_YEAR_DAYS_WIDTH}
            startDate={offsetDate.toDate()}
            endDate={dayjs().toDate()}
            value={[]}
            rectSize={12}
            rectProps={{
              rx: 2,
            }}
            weekLabels={false}
            legendCellSize={0}
            panelColors={{
              0: Greyscale_Grey_200,
              1: Primary_Theme_Pink_200,
            }}
          />
        </ActivityCalendarContent>
      </ActivityCalendarWrapper>
    </CouncilorShipCardWrapper>
  );
}
