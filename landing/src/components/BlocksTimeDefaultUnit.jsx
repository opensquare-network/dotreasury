// copied from site/src/components/BlocksTimeDefaultUnit.jsx
// without redux, chainSymbolSelector

import { useEffect, useState } from "react";
import TimePeriod from "../../../site/src/components/TimePeriod";
import { estimateBlocksTime } from "../../../site/src/services/chainApi";
import { useIsMounted } from "usehooks-ts";

export default function BlocksTimeDefaultUnit({ chain, blocks, ...others }) {
  const [time, setTime] = useState(0);
  const isMounted = useIsMounted();

  useEffect(() => {
    estimateBlocksTime(chain, blocks).then((blocksTime) => {
      if (isMounted()) {
        setTime(blocksTime);
      }
    });
  }, [chain, blocks, isMounted]);

  return <TimePeriod time={time} {...others} />;
}
