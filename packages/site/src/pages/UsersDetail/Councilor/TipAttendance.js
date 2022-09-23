import { chainSelector } from "../../../store/reducers/chainSlice";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/TableLoading";
import {
  fetchTipAttendance,
  tipAttendanceLoadingSelector,
  tipAttendanceSelector,
} from "../../../store/reducers/usersDetailSlice";
import { useEffect } from "react";
import { Card, CardTitle } from "./styled";
import AttendanceHeatMap from "../../../components/AttendanceHeatMap";

export default function TipAttendance() {
  const chain = useSelector(chainSelector);
  const dispatch = useDispatch();
  const { address } = useParams();

  const tips = useSelector(tipAttendanceSelector) || [];
  const loading = useSelector(tipAttendanceLoadingSelector);

  useEffect(() => {
    dispatch(fetchTipAttendance(chain, address));
  }, [dispatch, chain, address]);

  return (
    <Loading loading={loading}>
      <Card>
        <CardTitle>Tip Attendance</CardTitle>

        <AttendanceHeatMap
          data={compatAttendanceHeatMapData(tips)}
          activeColor="#B0D1F9"
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
