import CountDown from "../../components/_CountDown";
import { useSelector } from "react-redux";
import { scanHeightSelector } from "../../store/reducers/chainSlice";
import {
  EstimateTime,
  Gap,
  Flex,
  TooltipDiffHeight,
  TooltipInfoHeight,
} from "./styled";
import { useEstimateTime } from "../../utils/useEstimateTime";
import { useMemo } from "react";

export default function EstimateTimeCountDown({ blockHeight, denominator }) {
  const scanHeight = useSelector(scanHeightSelector);

  const { estimatedTimeString } = useEstimateTime(blockHeight);

  const diffHeight = useMemo(() => {
    if (scanHeight > blockHeight) {
      return 0;
    }

    return blockHeight - scanHeight;
  }, [scanHeight, blockHeight]);

  return (
    <Flex>
      <CountDown
        numerator={scanHeight}
        denominator={denominator}
        tooltipContent={
          <div>
            <TooltipDiffHeight>{diffHeight}</TooltipDiffHeight>
            <TooltipInfoHeight>
              {scanHeight} / {blockHeight}
            </TooltipInfoHeight>
          </div>
        }
      />

      <Gap />

      <EstimateTime>
        {blockHeight > scanHeight ? estimatedTimeString : 0}
      </EstimateTime>
    </Flex>
  );
}
