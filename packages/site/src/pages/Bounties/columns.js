import { useTableColumns } from "../../components/shared/useTableColumns";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { useState } from "react";

export function useColumns(options) {
  const { defaultCurator = true } = options ?? {};

  const symbol = useSelector(chainSymbolSelector);
  const [isCurator, setIsCurator] = useState(defaultCurator);

  const getDetailRoute = (row) => {
    const type = row.parentBountyId >= 0 ? "child-bounties" : "bounties";
    return `/${symbol.toLowerCase()}/${type}/${row.bountyIndex}`;
  };

  let {
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

  curator = {
    ...curator,
    headerCellProps: {
      onClick: toggleCuratorBeneficiary,
    }
  };
  beneficiary = {
    ...beneficiary,
    headerCellProps: {
      onClick: toggleCuratorBeneficiary,
    }
  };
  curator = {
    ...curator,
    show: isCurator,
  };
  beneficiary = {
    ...beneficiary,
    show: !isCurator,
  };

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
