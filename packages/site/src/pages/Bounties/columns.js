import { useTableColumns } from "../../components/shared/useTableColumns";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { useState } from "react";

export function useColumns() {
  const symbol = useSelector(chainSymbolSelector);
  const [isCurator, setIsCurator] = useState(true);

  const getDetailRoute = (row) => {
    const type = row.parentBountyId >= 0 ? "child-bounties" : "bounties";
    return `/${symbol.toLowerCase()}/${type}/${row.bountyIndex}`;
  };

  const {
    bountyIndex,
    proposeTime,
    curator,
    title,
    value,
    bountiesStatus,
    detailRoute,
    beneficiary,
  } = useTableColumns({ getDetailRoute, recognizeLinks: true });

  const toggleCuratorBeneficiary = () => {
    setIsCurator(!isCurator);
  };

  curator.headerCellProps = {
    onClick: toggleCuratorBeneficiary,
  };
  beneficiary.headerCellProps = {
    onClick: toggleCuratorBeneficiary,
  };
  curator.show = isCurator;
  beneficiary.show = !isCurator;

  const columns = [
    bountyIndex,
    proposeTime,
    curator,
    beneficiary,
    title,
    value,
    bountiesStatus,
    detailRoute,
  ];

  return {
    columns,
    getDetailRoute,
  };
}
