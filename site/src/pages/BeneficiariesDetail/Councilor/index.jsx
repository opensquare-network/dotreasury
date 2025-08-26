import { currentChainSettings } from "../../../utils/chains";
import CouncilorShip from "./CouncilorShip";
import MotionAttendance from "./MotionAttendance";
import TipAttendance from "./TipAttendance";

export default function Councilor() {
  return (
    <>
      <CouncilorShip />

      <MotionAttendance />

      {currentChainSettings.hasTips && <TipAttendance />}
    </>
  );
}
