import CountDown from "../../../components/OsnCountDown";
import { useSelector } from "react-redux";
import { scanHeightSelector } from "../../../store/reducers/chainSlice";
import {
  EstimateTime,
  Gap,
  Flex,
  TooltipDiffHeight,
  TooltipInfoHeight,
} from "./styled";
import { useMemo } from "react";
import { useEstimateTime } from "../../../utils/useEstimateTime";

export default function BountyPendingPayoutCountDown({ bountyDetail }) {
  const { timeline = [] } = bountyDetail ?? {};

  const awardTimeline = timeline.find((i) => i.name === "Awarded");
  const unlockAt = awardTimeline?.args?.unlockAt;
  const awardBlockHeight = awardTimeline?.indexer?.blockHeight;

  const scanHeight = useSelector(scanHeightSelector);

  const { estimatedTimeString } = useEstimateTime(awardBlockHeight);

  const diffHeight = useMemo(() => {
    if (scanHeight > unlockAt) {
      return 0;
    }

    return unlockAt - scanHeight;
  }, [scanHeight, unlockAt]);

  return (
    <Flex>
      <CountDown
        numerator={scanHeight}
        denominator={unlockAt}
        tooltipContent={
          <div>
            <TooltipDiffHeight>{diffHeight}</TooltipDiffHeight>
            <TooltipInfoHeight>
              {scanHeight} / {unlockAt}
            </TooltipInfoHeight>
          </div>
        }
      />

      <Gap />

      <EstimateTime>
        {awardBlockHeight > scanHeight ? estimatedTimeString : 0}
      </EstimateTime>
    </Flex>
  );
}
