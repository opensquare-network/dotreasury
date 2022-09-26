import {
  Card,
  CardTitle,
  TooltipContentDetail,
  TooltipContentDetailItem,
  TooltipContentDetailItemLabel,
  TooltipContentDetailItemValue,
} from "./styled";
import AttendanceHeatMap from "../../../components/AttendanceHeatMap";
import {
  motionAttendanceSelector,
  fetchMotionAttendance,
  motionAttendanceLoadingSelector,
} from "../../../store/reducers/usersDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { useEffect } from "react";
import { useParams } from "react-router";
import Loading from "../../../components/TableLoading";
import { makeSubsquareLink } from "../../../utils/url";
import ExternalLink from "../../../components/ExternalLink";

const MOTION_HEAT_MAP_TEXT = {
  active: "Aye",
  negative: "Nay",
  inActive: "No vote",
};

export default function MotionAttendance() {
  const chain = useSelector(chainSelector);
  const dispatch = useDispatch();
  const { address } = useParams();

  const motions = useSelector(motionAttendanceSelector) || [];
  const loading = useSelector(motionAttendanceLoadingSelector);

  useEffect(() => {
    dispatch(fetchMotionAttendance(chain, address));
  }, [dispatch, chain, address]);

  return (
    <Loading loading={loading}>
      <Card>
        <CardTitle>Motion Attendance</CardTitle>

        <AttendanceHeatMap
          data={compatAttendanceHeatMapData(motions)}
          negative
          showTooltip={(data) => data.type !== "inActive"}
          tooltipContentRender={(data) => (
            <TooltipContentDetail gap={35}>
              <TooltipContentDetailItem>
                <TooltipContentDetailItemLabel>
                  Motion
                </TooltipContentDetailItemLabel>
                <TooltipContentDetailItemValue>
                  <ExternalLink
                    href={makeSubsquareLink(
                      chain,
                      "council",
                      "motion",
                      data.meta.motionIndex
                    )}
                  >
                    #{data.meta.motionIndex}
                  </ExternalLink>
                </TooltipContentDetailItemValue>
              </TooltipContentDetailItem>
              <TooltipContentDetailItem>
                <TooltipContentDetailItemLabel>
                  Vote
                </TooltipContentDetailItemLabel>
                <TooltipContentDetailItemValue>
                  {MOTION_HEAT_MAP_TEXT[data.type]}
                </TooltipContentDetailItemValue>
              </TooltipContentDetailItem>
            </TooltipContentDetail>
          )}
          legendActiveText="Aye"
          legendNegativeText="Nay"
          legendInactiveText="No vote"
        />
      </Card>
    </Loading>
  );
}

function compatAttendanceHeatMapData(motions = []) {
  return motions.map((i) => {
    const latestVote = i.votes?.[0];

    return {
      type: !latestVote ? "inActive" : latestVote.aye ? "active" : "negative",
      meta: i,
    };
  });
}
