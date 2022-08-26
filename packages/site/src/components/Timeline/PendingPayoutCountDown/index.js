import CountDown from "../../../components/OsnCountDown";
import { useSelector } from "react-redux";
import { estimateBlocksTime } from "../../../services/chainApi";
import {
  scanHeightSelector,
  chainSelector,
} from "../../../store/reducers/chainSlice";
import { EstimateTime, Gap, Flex } from "./styled";
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

      <Gap />

      <EstimateTime>
        {awardBlockHeight > scanHeight ? parseEstimateTime(estimatedTime) : 0}
      </EstimateTime>
    </Flex>
  );
}
