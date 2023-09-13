import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/TableLoading";
import {
  fetchTipAttendance,
  resetTipAttendance,
  tipAttendanceLoadingSelector,
  tipAttendanceSelector,
} from "../../../store/reducers/usersDetailSlice";
import { useEffect } from "react";
import {
  Card,
  CardTitle,
  CardTitleDescription,
  TooltipContentDetail,
  TooltipContentDetailItem,
  TooltipContentDetailItemLabel,
  TooltipContentDetailItemValue,
} from "./styled";
import HeatMap from "../../../components/HeatMap";
import { Link } from "react-router-dom";
import { makeInSiteTipLink } from "../../../utils/url";
import { ellipsis } from "../../../utils/ellipsis";
import { toPrecision, getPrecision } from "../../../utils";
import { sortBy } from "lodash";

export default function TipAttendance() {
  const chainSymbol = useSelector(chainSymbolSelector);
  const dispatch = useDispatch();
  const { address } = useParams();

  const tips = useSelector(tipAttendanceSelector) || [];
  const loading = useSelector(tipAttendanceLoadingSelector);

  useEffect(() => {
    dispatch(fetchTipAttendance(address));

    return () => {
      dispatch(resetTipAttendance());
    };
  }, [dispatch, address]);

  function parseValue(value) {
    const precision = toPrecision(value, getPrecision(chainSymbol), false);
    return Number(precision).toLocaleString();
  }

  return (
    <Loading loading={loading}>
      <Card>
        <CardTitle>
          Tip Attendance
          <CardTitleDescription>Blocks low to high</CardTitleDescription>
        </CardTitle>

        <HeatMap
          dotStyle="circle"
          data={compatAttendanceHeatMapData(tips)}
          activeColor="var(--blue200)"
          tooltipContentRender={(data) => (
            <TooltipContentDetail gap={35}>
              <TooltipContentDetailItem>
                <TooltipContentDetailItemLabel>
                  Tip hash
                </TooltipContentDetailItemLabel>
                <TooltipContentDetailItemValue>
                  <Link
                    to={makeInSiteTipLink(
                      "tips",
                      data.meta.tipHeight,
                      data.meta.tipHash,
                    )}
                  >
                    {ellipsis(data.meta.tipHash)}
                  </Link>
                </TooltipContentDetailItemValue>
              </TooltipContentDetailItem>
              <TooltipContentDetailItem>
                <TooltipContentDetailItemLabel>
                  Tip height
                </TooltipContentDetailItemLabel>
                <TooltipContentDetailItemValue>
                  {data.meta.tipHeight.toLocaleString?.()}
                </TooltipContentDetailItemValue>
              </TooltipContentDetailItem>
              <TooltipContentDetailItem>
                <TooltipContentDetailItemLabel>
                  Value
                </TooltipContentDetailItemLabel>
                <TooltipContentDetailItemValue>
                  {data.meta.tips?.length
                    ? `${parseValue(data.meta.tips?.[0]?.value)} ${chainSymbol}`
                    : "-"}
                </TooltipContentDetailItemValue>
              </TooltipContentDetailItem>
            </TooltipContentDetail>
          )}
          legendActiveText="Tip"
          legendInactiveText="No tip"
        />
      </Card>
    </Loading>
  );
}

function compatAttendanceHeatMapData(tips = []) {
  const sorted = sortBy(tips, "tipHeight");

  return sorted.map((i) => {
    return {
      type: i?.tips?.length ? "active" : "inActive",
      meta: i,
    };
  });
}
