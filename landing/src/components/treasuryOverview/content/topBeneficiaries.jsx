import { Table } from "../../../../../site/src/components/Table";
import Card from "../../../../../site/src/components/Card";
import { DOT_OVERVIEW_DATA, KSM_OVERVIEW_DATA } from "../../../fixtures";
import { getChainSettings } from "../../../utils/chains";
import Balance from "../../balance";
import ExternalLink from "../../../../../site/src/components/ExternalLink";
import { cn } from "../../../utils";
import IconMask from "../../../../../site/src/components/Icon/Mask";
import User from "../../user";
import { USER_ROLES } from "../../../../../site/src/constants";

// FIXME: landing, overview data from server
const OVERVIEW_DATA = {
  polkadot: DOT_OVERVIEW_DATA,
  kusama: KSM_OVERVIEW_DATA,
};

export default function TreasuryOverviewTopBeneficiaries({ chain = "" }) {
  const overview = OVERVIEW_DATA[chain];
  const { symbol } = getChainSettings(chain);
  const data = overview?.bestProposalBeneficiaries || [];

  const columns = [
    {
      id: "beneficiary",
      title: "Beneficiary",
      cellRender: (_, item) => (
        <User
          chain={chain}
          role={USER_ROLES.Beneficiary}
          address={item.beneficiary}
        />
      ),
    },
    {
      id: "totalValue",
      title: "Total Value",
      headerCellClassName: "!text-right",
      cellRender: (_, item) => (
        <Balance
          value={item.value}
          usdt={item.fiatValue}
          reverse
          isUnitPrice={false}
          symbol={symbol}
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
            href={`https://${chain}.dotreasury.com/proposal-beneficiaries`}
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

      <div className="[&_table]:!rounded-none overflow-scroll">
        <Table columns={columns} data={data} />
      </div>
    </Card>
  );
}
