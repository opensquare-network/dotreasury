import { cn } from "../../../utils";
import OverviewAmount from "./amount";
import OverviewSummary from "./summary";
import OverviewTopBeneficiaries from "./topBeneficiaries";
import OverviewTotalStacked from "./totalStacked";

export default function OverviewContent({ chain = "" }) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-x-4",
        "max-md:block max-md:space-y-4",
      )}
    >
      <div className="row-span-3 col-span-1">
        <OverviewSummary chain={chain} />
      </div>

      <div className="space-y-4 col-span-2">
        <div className="col-span-2">
          <OverviewTotalStacked chain={chain} />
        </div>

        <div
          className={cn(
            "grid grid-cols-2 gap-4",
            "max-md:block max-md:space-y-4",
          )}
        >
          <OverviewAmount chain={chain} />
          <OverviewTopBeneficiaries chain={chain} />
        </div>
      </div>
    </div>
  );
}
