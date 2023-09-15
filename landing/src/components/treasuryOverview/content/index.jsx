import TreasuryOverviewAmount from "./amount";
import TreasuryOverviewSummary from "./summary";
import TreasuryOverviewTopBeneficiaries from "./topBeneficiaries";
import TreasuryOverviewTotalStacked from "./totalStacked";

export default function TreasuryOverviewContent({ chain = "" }) {
  return (
    <div className="grid grid-rows-3 grid-cols-3 grid-flow-col gap-4 h-[944px]">
      <div className="row-span-3 col-span-1">
        <TreasuryOverviewSummary chain={chain} />
      </div>

      <div className="col-span-2">
        <TreasuryOverviewTotalStacked chain={chain} />
      </div>

      <div className="row-span-2 col-span-2 grid grid-cols-2 gap-4">
        <TreasuryOverviewAmount />
        <TreasuryOverviewTopBeneficiaries />
      </div>
    </div>
  );
}
