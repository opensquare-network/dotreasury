import React, { useEffect, useState } from "react";
import TimePeriod from "./TimePeriod";
import { estimateBlocksTime } from "../services/chainApi";
import { useIsMounted } from "../utils/hooks"

export default function BlocksTime({ blocks, unitMapper = {}, pluralUnitMapper = {}, ...others }) {
  const [time, setTime] = useState(0);
  const isMounted = useIsMounted();

  useEffect(() => {
    estimateBlocksTime(blocks).then(blocksTime => {
      if (isMounted.current) {
        setTime(blocksTime);
      }
    });
  }, [blocks, isMounted]);

  return (
    <TimePeriod
      time={time}
      unitMapper={Object.assign({ y: "yr", d: "day", h: "hr", s: "sec" }, unitMapper)}
      pluralUnitMapper={Object.assign({ y: "yrs", mon: "mons", d: "days", h: "hrs", min: "mins", s: "secs" }, pluralUnitMapper)}
      {...others}
    />
  );
}
