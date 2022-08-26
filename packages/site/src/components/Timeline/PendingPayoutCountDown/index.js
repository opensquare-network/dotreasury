import { CountDown, Flex, Gap } from "@osn/common-ui";
import { useSelector } from "react-redux";
import { estimateBlocksTime } from "../../../services/chainApi";
import {
  scanHeightSelector,
  chainSelector,
} from "../../../store/reducers/chainSlice";
import { EstimateTime } from "./styled";
import { extractTime } from "@polkadot/util";
import { useEffect, useState } from "react";
import { parseEstimateTime } from "./parseEstimateTime";

export default function PendingPayoutCountDown({
  awardBlockHeight,
  unlockBlockHeight,
}) {
  const chain = useSelector(chainSelector);
  const scanHeight = useSelector(scanHeightSelector);

  const [estimatedTime, setEstimatedTime] = useState({});

  useEffect(() => {
    estimateBlocksTime(chain, scanHeight - awardBlockHeight).then((v) => {
      const time = extractTime(Math.abs(v));
      setEstimatedTime(time);
    });
  }, [chain, scanHeight, awardBlockHeight]);

  return (
    <Flex>
      <CountDown
        blockHeight={scanHeight}
        endBlockHeight={awardBlockHeight}
        startBlockHeight={unlockBlockHeight}
      />

      <Gap inline mr={5} />

      <EstimateTime>
        {awardBlockHeight > scanHeight ? parseEstimateTime(estimatedTime) : 0}
      </EstimateTime>
    </Flex>
  );
}
