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

export default function EstimateTimeCountDown({
  startBlockHeight = 0,
  endBlockHeight = 0,
}) {
  const scanHeight = useSelector(scanHeightSelector);

  const { estimatedTimeString } = useEstimateTime(endBlockHeight);

  const diffHeight = useMemo(() => {
    if (scanHeight > endBlockHeight) {
      return 0;
    }

    return endBlockHeight - scanHeight;
  }, [scanHeight, endBlockHeight]);

  return (
    <Flex>
      <CountDown
        numerator={scanHeight - startBlockHeight}
        denominator={endBlockHeight - startBlockHeight}
        tooltipContent={
          <div>
            <TooltipDiffHeight>{diffHeight}</TooltipDiffHeight>
            <TooltipInfoHeight>
              {scanHeight} / {endBlockHeight}
            </TooltipInfoHeight>
          </div>
        }
      />

      <Gap />

      <EstimateTime>
        {endBlockHeight > scanHeight ? estimatedTimeString : 0}
      </EstimateTime>
    </Flex>
  );
}
