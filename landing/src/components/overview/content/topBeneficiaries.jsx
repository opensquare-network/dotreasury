import { Table } from "@site/src/components/Table";
import Card from "@site/src/components/Card";
import Balance from "../../balance";
import ExternalLink from "@site/src/components/ExternalLink";
import { cn } from "../../../utils";
import IconMask from "@site/src/components/Icon/Mask";
import User from "../../user";
import { USER_ROLES } from "@site/src/constants";
import { useTopBeneficiaries } from "../../../hooks/useData";

export default function OverviewTopBeneficiaries({ chain = "" }) {
  const bestProposalBeneficiaries = useTopBeneficiaries(chain);
  const data = bestProposalBeneficiaries?.items || [];

  const columns = [
    {
      id: "beneficiary",
      title: "Beneficiary",
      cellRender: (_, item) => (
        <User
          chain={chain}
          role={USER_ROLES.Beneficiary}
          address={item.address}
        />
      ),
    },
    {
      id: "totalValue",
      title: "Total Value",
      headerCellClassName: "!text-right",
      cellRender: (_, item) => (
        <Balance
          chain={chain}
          value={item?.totalValue?.totalBenefit}
          usdt={item?.totalFiatValue?.totalBenefit}
          reverse
          isUnitPrice={false}
        />
      ),
    },
  ];

  return (
    <Card className="h-full !p-0">
      <div className="flex items-center justify-between p-6">
        <h4 className="h4-16-semibold">Top Beneficiaries</h4>
        <div>
          <ExternalLink
            href={`https://${chain}.dotreasury.com/#/users?role=beneficiary`}
            className={cn(
              "text-textSecondary p-12-normal inline-flex items-center",
              "hover:text-textPrimary [&_i]:hover:bg-textPrimary",
            )}
          >
            View All
            <IconMask
              src="/imgs/caret-right.svg"
              color="textSecondary"
              size={16}
            />
          </ExternalLink>
        </div>
      </div>

      <div
        className={cn(
          "overflow-scroll rounded-[inherit]",
          "[&_table]:!rounded-t-none [&_table]:!rounded-b-[inherit] [&_table]:!border-none",
        )}
      >
        <Table columns={columns} data={data} />
      </div>
    </Card>
  );
}
