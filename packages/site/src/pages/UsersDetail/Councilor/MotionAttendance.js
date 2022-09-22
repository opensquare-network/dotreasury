import { Card, CardTitle } from "./styled";
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
