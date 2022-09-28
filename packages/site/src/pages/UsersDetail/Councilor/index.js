import CouncilorShip from "./CouncilorShip";
import MotionAttendance from "./MotionAttendance";
import TipAttendance from "./TipAttendance";
import Grade from "./Grade";

export default function Councilor({ role }) {
  return (
    <>
      <CouncilorShip />

      <MotionAttendance />

      <TipAttendance />

      <Grade />
    </>
  );
}
