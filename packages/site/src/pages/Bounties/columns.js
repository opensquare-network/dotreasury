import { useTableColumns } from "../../components/shared/useTableColumns";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

export function useColumns() {
  const symbol = useSelector(chainSymbolSelector);

  const getDetailRoute = (row) => {
    const type = row.parentBountyId >= 0 ? "child-bounties" : "bounties";
    return `/${symbol.toLowerCase()}/${type}/${row.bountyIndex}`;
  };

  const { index, proposeTime, curator, title, value, status, detailRoute } =
    useTableColumns({ getDetailRoute });

  const columns = [
    index,
    proposeTime,
    curator,
    title,
    value,
    status,
    detailRoute,
  ];

  return {
    columns,
    getDetailRoute,
  };
}
