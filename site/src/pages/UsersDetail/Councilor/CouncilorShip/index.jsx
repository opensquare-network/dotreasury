import {
  CardTitle,
  Card,
  TooltipContentDetail,
  TooltipContentDetailItem,
  TooltipContentDetailItemLabel,
  TooltipContentDetailItemValue,
  CardTitleDescription,
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
import { CouncilorShipLoading } from "./styled";
import { sortBy } from "lodash";
import HeatMap from "../../../../components/HeatMap";
import ExternalLink from "../../../../components/ExternalLink";
import { makeSubscanLink } from "../../../../utils/url";

export default function CouncilorShip() {
  const dispatch = useDispatch();
  const chain = useSelector(chainSelector);
  const { address } = useParams();

  const councilorShip = useSelector(councilorShipSelector) || [];
  const loading = useSelector(councilorShipLoadingSelector);

  useEffect(() => {
    dispatch(fetchCouncilorShipTerms(address));

    return () => {
      dispatch(resetCouncilorShipTerms());
    };
  }, [dispatch, address]);

  return (
    <CouncilorShipLoading loading={loading}>
      <Card>
        <CardTitle>
          Councilor Ship
          <CardTitleDescription>Terms old to new</CardTitleDescription>
        </CardTitle>

        <HeatMap
          data={compatActivityCalendarData(councilorShip)}
          activeColor="var(--pink200)"
          tooltipContentRender={(data) => {
            return <CouncilorInfo chain={chain} data={data} />;
          }}
        />
      </Card>{" "}
    </CouncilorShipLoading>
  );
}

function compatActivityCalendarData(councilorShip = []) {
  const sorted = sortBy(councilorShip, "indexer.blockHeight");

  return sorted.map((i) => {
    return {
      type: i.isCouncilor ? "active" : "inActive",
      meta: i,
    };
  });
}

function CouncilorInfo({ chain, data }) {
  return (
    <TooltipContentDetail gap={30}>
      <TooltipContentDetailItem>
        <TooltipContentDetailItemLabel>
          Start height
        </TooltipContentDetailItemLabel>
        <TooltipContentDetailItemValue>
          <ExternalLink
            href={makeSubscanLink(
              chain,
              "block",
              data.meta?.indexer?.blockHeight,
            )}
          >
            {data.meta?.indexer?.blockHeight?.toLocaleString?.() || "-"}
          </ExternalLink>
        </TooltipContentDetailItemValue>
      </TooltipContentDetailItem>
      <TooltipContentDetailItem>
        <TooltipContentDetailItemLabel>
          Start time
        </TooltipContentDetailItemLabel>
        <TooltipContentDetailItemValue>
          {dayjs(data.meta?.indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
        </TooltipContentDetailItemValue>
      </TooltipContentDetailItem>
      <TooltipContentDetailItem>
        <TooltipContentDetailItemLabel>Elected</TooltipContentDetailItemLabel>
        <TooltipContentDetailItemValue>
          {data.meta?.isCouncilor ? "True" : "False"}
        </TooltipContentDetailItemValue>
      </TooltipContentDetailItem>
    </TooltipContentDetail>
  );
}
