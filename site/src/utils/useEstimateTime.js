import { parseEstimateTime } from "./parseEstimateTime";
import { estimateBlocksTime } from "../services/chainApi";
import { useEffect, useState } from "react";
import { extractTime } from "@polkadot/util";
import { useSelector } from "react-redux";
import {
  scanHeightSelector,
  chainSelector,
} from "../store/reducers/chainSlice";

export function useEstimateTime(blockHeight) {
  const scanHeight = useSelector(scanHeightSelector);
  const chain = useSelector(chainSelector);

  const [estimatedTime, setEstimatedTime] = useState({});
  const [estimatedTimeString, setEstimatedTimeString] = useState("");

  useEffect(() => {
    estimateBlocksTime(chain, scanHeight - blockHeight).then((v) => {
      const time = extractTime(Math.abs(v));
      setEstimatedTime(time);
      setEstimatedTimeString(parseEstimateTime(time));
    });
  }, [chain, scanHeight, blockHeight]);

  return {
    estimatedTime,
    estimatedTimeString,
  };
}
