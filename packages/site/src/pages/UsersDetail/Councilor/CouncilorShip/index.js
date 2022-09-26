import { CardTitle, Card } from "../styled";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  councilorShipSelector,
  fetchCouncilorShipTerms,
} from "../../../../store/reducers/usersDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector } from "../../../../store/reducers/chainSlice";
import { useParams } from "react-router";
import ActivityCalendar from "../ActivityCalendar";
import { TooltipContentDate, TooltipContentCount } from "./styled";

export default function CouncilorShip() {
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);
  const { address } = useParams();

  const councilorShip = useSelector(councilorShipSelector) || [];

  useEffect(() => {
    dispatch(fetchCouncilorShipTerms(chain, address));
  }, [dispatch, chain, address]);

  return (
    <Card>
      <CardTitle>Councilor Ship</CardTitle>

      <ActivityCalendar
        value={compatActivityCalendarData(councilorShip)}
        showTooltip
        tooltipContentRender={(data) => (
          <div>
            <TooltipContentCount>Count: {data.count || 0}</TooltipContentCount>
            <TooltipContentDate>
              {data.meta
                ? dayjs(data.meta?.indexer?.blockTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                : dayjs(data.date).format("YYYY-MM-DD")}
            </TooltipContentDate>
          </div>
        )}
      />
    </Card>
  );
}

function compatActivityCalendarData(councilorShip = []) {
  return councilorShip
    .filter((i) => i.isCouncilor)
    .map((i) => {
      return {
        date: dayjs(i.indexer.blockTime).format("YYYY/MM/DD"),
        count: 1,
        meta: i,
      };
    });
}
