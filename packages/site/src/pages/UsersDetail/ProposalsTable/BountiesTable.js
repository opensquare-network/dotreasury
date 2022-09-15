import { noop } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector } from "../../../store/reducers/chainSlice";
import BountiesTableOrigin from "../../Bounties/BountiesTable";
import {
  fetchBounties,
  loadingSelector,
  bountyListSelector,
} from "../../../store/reducers/bountySlice";
import { useEffect } from "react";
import { resolveFilterData } from "./resolveFilterData";

export default function BountiesTable({
  header,
  footer = noop,
  tablePage,
  pageSize,
  filterData,
  role,
  address,
}) {
  const chain = useSelector(chainSelector);
  const dispatch = useDispatch();

  const { items, total } = useSelector(bountyListSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    dispatch(
      fetchBounties(
        chain,
        tablePage - 1,
        pageSize,
        resolveFilterData(filterData, { role, address })
      )
    );
  }, [dispatch, chain, tablePage, pageSize, filterData, role, address]);

  return (
    <BountiesTableOrigin
      header={header}
      loading={loading}
      data={items}
      footer={!!items.length && footer(totalPages)}
    />
  );
}
