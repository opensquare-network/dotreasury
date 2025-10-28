import { SpendPeriodDisplay } from "../../Summary";
import useSpendPeriodSummary from "./useSpendPeriodSummary";

export default function KusamaSpendPeriod() {
  const summary = useSpendPeriodSummary();

  return <SpendPeriodDisplay spendPeriod={summary} />;
}
