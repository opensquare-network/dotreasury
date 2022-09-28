import {
  CardTitle,
  Card,
  TooltipContentDetail,
  TooltipContentDetailItem,
  TooltipContentDetailItemLabel,
  TooltipContentDetailItemValue,
} from "../styled";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  councilorShipSelector,
  councilorShipLoadingSelector,
  fetchCouncilorShipTerms,
  resetCouncilorShipTerms,
} from "../../../../store/reducers/usersDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector } from "../../../../store/reducers/chainSlice";
import { useParams } from "react-router";
import ActivityCalendar from "../ActivityCalendar";
import { CouncilorShipLoading } from "./styled";

export default function CouncilorShip() {
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);
  const { address } = useParams();

  const councilorShip = useSelector(councilorShipSelector) || [];
  const loading = useSelector(councilorShipLoadingSelector);

  useEffect(() => {
    dispatch(fetchCouncilorShipTerms(chain, address));

    return () => {
      dispatch(resetCouncilorShipTerms());
    };
  }, [dispatch, chain, address]);

  return (
    <CouncilorShipLoading loading={loading}>
      <Card>
        <CardTitle>Councilor Ship</CardTitle>

        <ActivityCalendar
          value={compatActivityCalendarData(councilorShip)}
          showTooltip
          tooltipContentRender={(data) => {
            // FIXME: councilor multi-terms
            return <CouncilorInfo data={data} />;
          }}
        />
      </Card>
    </CouncilorShipLoading>
  );
}

function compatActivityCalendarData(councilorShip = []) {
  return councilorShip.map((i) => {
    return {
      date: dayjs(i.indexer.blockTime).format("YYYY/MM/DD"),
      count: 1,
      meta: i,
    };
  });
}

function CouncilorInfo({ data }) {
  return (
    <TooltipContentDetail gap={30}>
      <TooltipContentDetailItem>
        <TooltipContentDetailItemLabel>
          Start height
        </TooltipContentDetailItemLabel>
        <TooltipContentDetailItemValue>
          {data.meta?.indexer?.blockHeight?.toLocaleString?.() || "-"}
        </TooltipContentDetailItemValue>
      </TooltipContentDetailItem>
      <TooltipContentDetailItem>
        <TooltipContentDetailItemLabel>
          Start time
        </TooltipContentDetailItemLabel>
        <TooltipContentDetailItemValue>
          {data.count
            ? dayjs(data.meta?.indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </TooltipContentDetailItemValue>
      </TooltipContentDetailItem>
      <TooltipContentDetailItem>
        <TooltipContentDetailItemLabel>Elected</TooltipContentDetailItemLabel>
        <TooltipContentDetailItemValue>
          {data.count ? "True" : "False"}
        </TooltipContentDetailItemValue>
      </TooltipContentDetailItem>
    </TooltipContentDetail>
  );
}
