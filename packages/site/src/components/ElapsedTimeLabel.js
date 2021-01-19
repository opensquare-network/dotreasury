import React from "react";
import TimeElapsed from "./TimeElapsed";
import TimeLabel from "./TimeLabel";

const ElapsedTimeLabel = ({ time }) => {
  return (
    <TimeLabel value={<TimeElapsed from={time} />} />
  );
};

export default ElapsedTimeLabel;
