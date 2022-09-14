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

export default function BountiesTable({
  header,
  footer = noop,
  tablePage,
  pageSize,
}) {
  const chain = useSelector(chainSelector);
  const dispatch = useDispatch();

  const { items, total } = useSelector(bountyListSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    dispatch(fetchBounties(chain, tablePage - 1, pageSize));
  }, [dispatch, chain, tablePage, pageSize]);

  return (
    <BountiesTableOrigin
      header={header}
      loading={loading}
      data={items}
      footer={!!items.length && footer(totalPages)}
    />
  );
}
