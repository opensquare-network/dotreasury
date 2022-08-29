import EstimateTimeCountDown from "../../EstimateTimeCountdown";

export default function BountyPendingPayoutCountDown({ bountyDetail }) {
  const { timeline = [] } = bountyDetail ?? {};

  const awardTimeline = timeline.find((i) => i.name === "Awarded");
  const unlockAt = awardTimeline?.args?.unlockAt;
  const awardBlockHeight = awardTimeline?.indexer?.blockHeight;

  return (
    <EstimateTimeCountDown
      blockHeight={awardBlockHeight}
      denominator={unlockAt}
    />
  );
}
