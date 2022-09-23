import CouncilorShip from "./CouncilorShip";
import MotionAttendance from "./MotionAttendance";
import TipAttendance from "./TipAttendance";

export default function Councilor({ role }) {
  return (
    <>
      <CouncilorShip />

      <MotionAttendance />

      <TipAttendance />
    </>
  );
}
