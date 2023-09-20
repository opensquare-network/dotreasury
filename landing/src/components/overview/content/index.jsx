import { cn } from "../../../utils";
import OverviewAmount from "./amount";
import OverviewSummary from "./summary";
import OverviewTopBeneficiaries from "./topBeneficiaries";
import OverviewTotalStacked from "./totalStacked";

export default function OverviewContent({ chain = "" }) {
  return (
    <div
      className={cn(
        "grid grid-rows-3 grid-cols-3 grid-flow-col gap-4",
        "md:min-h-[944px]",
        "max-md:block max-md:space-y-4",
      )}
    >
      <div className="row-span-3 col-span-1">
        <OverviewSummary chain={chain} />
      </div>

      <div className="col-span-2">
        <OverviewTotalStacked chain={chain} />
      </div>

      <div
        className={cn(
          "row-span-2 col-span-2 grid grid-cols-2 gap-4",
          "max-md:block max-md:space-y-4",
        )}
      >
        <OverviewAmount chain={chain} />
        <OverviewTopBeneficiaries chain={chain} />
      </div>
    </div>
  );
}
