import {
  chainSelector,
  chainSymbolSelector,
} from "../../../store/reducers/chainSlice";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/TableLoading";
import {
  fetchTipAttendance,
  tipAttendanceLoadingSelector,
  tipAttendanceSelector,
} from "../../../store/reducers/usersDetailSlice";
import { useEffect } from "react";
import {
  Card,
  CardTitle,
  TooltipContentDetail,
  TooltipContentDetailItem,
  TooltipContentDetailItemLabel,
  TooltipContentDetailItemValue,
} from "./styled";
import AttendanceHeatMap from "../../../components/AttendanceHeatMap";
import { Link } from "react-router-dom";
import { makeInSiteTipLink } from "../../../utils/url";
import { ellipsis } from "../../../utils/ellipsis";
import Balance from "../../../components/Balance";
import { toPrecision, getPrecision } from "../../../utils";

export default function TipAttendance() {
  const chain = useSelector(chainSelector);
  const chainSymbol = useSelector(chainSymbolSelector);
  const dispatch = useDispatch();
  const { address } = useParams();

  const tips = useSelector(tipAttendanceSelector) || [];
  const loading = useSelector(tipAttendanceLoadingSelector);

  useEffect(() => {
    dispatch(fetchTipAttendance(chain, address));
  }, [dispatch, chain, address]);

  function parseValue(value) {
    const precision = toPrecision(value, getPrecision(chainSymbol), false);
    return Number(precision).toLocaleString();
  }

  return (
    <Loading loading={loading}>
      <Card>
        <CardTitle>Tip Attendance</CardTitle>

        <AttendanceHeatMap
          data={compatAttendanceHeatMapData(tips)}
          activeColor="#B0D1F9"
          showTooltip={(data) => data.type !== "inActive"}
          tooltipContentRender={(data) => (
            <TooltipContentDetail gap={35}>
              <TooltipContentDetailItem>
                <TooltipContentDetailItemLabel>
                  Created height
                </TooltipContentDetailItemLabel>
                <TooltipContentDetailItemValue>
                  #{data.meta.tipHeight}
                </TooltipContentDetailItemValue>
              </TooltipContentDetailItem>
              <TooltipContentDetailItem>
                <TooltipContentDetailItemLabel>
                  Tip hash
                </TooltipContentDetailItemLabel>
                <TooltipContentDetailItemValue>
                  <Link
                    to={makeInSiteTipLink(
                      chainSymbol.toLowerCase(),
                      "tips",
                      data.meta.tipHeight,
                      data.meta.tipHash
                    )}
                  >
                    {ellipsis(data.meta.tipHash)}
                  </Link>
                </TooltipContentDetailItemValue>
              </TooltipContentDetailItem>
              <TooltipContentDetailItem>
                <TooltipContentDetailItemLabel>
                  Value
                </TooltipContentDetailItemLabel>
                <TooltipContentDetailItemValue>
                  {parseValue(data.meta.tips?.[0]?.value)} {chainSymbol}
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
  return tips.map((i) => {
    return {
      type: i?.tips?.length ? "active" : "inActive",
      meta: i,
    };
  });
}
