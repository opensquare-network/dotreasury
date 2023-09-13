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
import {
  motionAttendanceSelector,
  fetchMotionAttendance,
  motionAttendanceLoadingSelector,
  resetMotionAttendance,
} from "../../../store/reducers/usersDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { useEffect } from "react";
import { useParams } from "react-router";
import Loading from "../../../components/TableLoading";
import { makeSubsquareLink } from "../../../utils/url";
import ExternalLink from "../../../components/ExternalLink";
import { sortBy } from "lodash";

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
    dispatch(fetchMotionAttendance(address));

    return () => {
      dispatch(resetMotionAttendance());
    };
  }, [dispatch, address]);

  return (
    <Loading loading={loading}>
      <Card>
        <CardTitle>
          Motion Attendance
          <CardTitleDescription>Blocks low to high</CardTitleDescription>
        </CardTitle>

        <HeatMap
          dotStyle="circle"
          data={compatAttendanceHeatMapData(motions)}
          negative
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
                      data.meta.motionIndex,
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
                  {MOTION_HEAT_MAP_TEXT[data.type] !==
                  MOTION_HEAT_MAP_TEXT.inActive
                    ? MOTION_HEAT_MAP_TEXT[data.type]
                    : "-"}
                </TooltipContentDetailItemValue>
              </TooltipContentDetailItem>
            </TooltipContentDetail>
          )}
          legendActiveText={MOTION_HEAT_MAP_TEXT.active}
          legendNegativeText={MOTION_HEAT_MAP_TEXT.negative}
          legendInactiveText={MOTION_HEAT_MAP_TEXT.inActive}
          negativeColor="var(--pink200)"
          activeColor="var(--green200)"
        />
      </Card>
    </Loading>
  );
}

function compatAttendanceHeatMapData(motions = []) {
  const sorted = sortBy(motions, "motionHeight");

  return sorted.map((i) => {
    const latestVote = i.votes?.[0];

    return {
      type: !latestVote ? "inActive" : latestVote.aye ? "active" : "negative",
      meta: i,
    };
  });
}
