import { cn } from "../../../utils";
import TreasuryOverviewAmount from "./amount";
import TreasuryOverviewSummary from "./summary";
import TreasuryOverviewTopBeneficiaries from "./topBeneficiaries";
import TreasuryOverviewTotalStacked from "./totalStacked";

export default function TreasuryOverviewContent({ chain = "" }) {
  return (
    <div
      className={cn(
        "grid grid-rows-3 grid-cols-3 grid-flow-col gap-4",
        "md:min-h-[944px]",
        "max-md:block max-md:space-y-4",
      )}
    >
      <div className="row-span-3 col-span-1">
        <TreasuryOverviewSummary chain={chain} />
      </div>

      <div className="col-span-2">
        <TreasuryOverviewTotalStacked chain={chain} />
      </div>

      <div
        className={cn(
          "row-span-2 col-span-2 grid grid-cols-2 gap-4",
          "max-md:block max-md:space-y-4",
        )}
      >
        <TreasuryOverviewAmount chain={chain} />
        <TreasuryOverviewTopBeneficiaries chain={chain} />
      </div>
    </div>
  );
}
