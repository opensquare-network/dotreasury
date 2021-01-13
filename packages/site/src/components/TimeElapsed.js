import React from "react";
import TimePeriod from "./TimePeriod";
import dayjs from 'dayjs'

export default function TimeElapsed({ from }) {
  if (from) {
    const nFrom = parseInt(from);
    return <TimePeriod time={dayjs().diff(nFrom)} />;
  }

  return <div />;
}
