import { Card, CardTitle } from "./styled";
import AttendanceHeatMap from "../../../components/AttendanceHeatMap";
import {
  motionAttendanceSelector,
  fetchMotionAttendance,
} from "../../../store/reducers/usersDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { useEffect } from "react";
import { useParams } from "react-router";

export default function MotionAttendance() {
  const chain = useSelector(chainSelector);
  const dispatch = useDispatch();
  const { address } = useParams();

  const motions = useSelector(motionAttendanceSelector);

  useEffect(() => {
    dispatch(fetchMotionAttendance(chain, address));
  }, [dispatch]);

  return (
    <Card>
      <CardTitle>Motion Attendance</CardTitle>

      <AttendanceHeatMap
        data={motions}
        negative
        legendActiveText="Aye"
        legendNegativeText="Nay"
        legendInactiveText="No vote"
      />
    </Card>
  );
}
