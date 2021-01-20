import React, { useEffect, useState } from "react";
import TimePeriod from "./TimePeriod";
import { estimateBlocksTime } from "../services/chainApi";
import { useIsMounted } from "../utils/hooks";

export default function BlocksTimeDefaultUnit({ blocks, ...others }) {
  const [time, setTime] = useState(0);
  const isMounted = useIsMounted();

  useEffect(() => {
    estimateBlocksTime(blocks).then((blocksTime) => {
      if (isMounted.current) {
        setTime(blocksTime);
      }
    });
  }, [blocks, isMounted]);

  return <TimePeriod time={time} {...others} />;
}
