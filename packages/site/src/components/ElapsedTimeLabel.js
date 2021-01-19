import React from "react";
import TimeElapsed from "./TimeElapsed";
import TimeLabel from "./TimeLabel";

const ElapsedTimeLabel = ({ time }) => {
  console.log(time);
  return (
    <TimeLabel value={<TimeElapsed from={time} />} />
  );
};

export default ElapsedTimeLabel;
