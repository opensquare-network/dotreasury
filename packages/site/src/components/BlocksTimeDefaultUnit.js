import React, { useEffect, useState } from "react";
import TimePeriod from "./TimePeriod";
import { estimateBlocksTime } from "../services/chainApi";
import { useIsMounted } from "../utils/hooks";
import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";

export default function BlocksTimeDefaultUnit({ blocks, ...others }) {
  const [time, setTime] = useState(0);
  const isMounted = useIsMounted();
  const chain = useSelector(chainSelector);

  useEffect(() => {
    estimateBlocksTime(chain, blocks).then((blocksTime) => {
      if (isMounted.current) {
        setTime(blocksTime);
      }
    });
  }, [chain, blocks, isMounted]);

  return <TimePeriod time={time} {...others} />;
}
