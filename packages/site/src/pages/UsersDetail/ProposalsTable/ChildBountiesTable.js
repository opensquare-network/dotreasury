import { noop } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector } from "../../../store/reducers/chainSlice";
import ChildBountiesTableOrigin from "../../ChildBounties/ChildBountiesTable";
import {
  fetchChildBounties,
  loadingSelector,
  childBountyListSelector,
} from "../../../store/reducers/bountySlice";
import { useEffect, useMemo } from "react";
import { compatChildBountyData } from "../../ChildBounties/utils";

export default function ChildBountiesTable({
  header,
  footer = noop,
  tablePage,
  pageSize,
}) {
  const chain = useSelector(chainSelector);
  const dispatch = useDispatch();

  const { items: data, total } = useSelector(childBountyListSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    dispatch(fetchChildBounties(chain, tablePage - 1, pageSize));
  }, [dispatch, chain, tablePage, pageSize]);

  const items = useMemo(() => data.map(compatChildBountyData), [data]);

  return (
    <ChildBountiesTableOrigin
      header={header}
      loading={loading}
      data={items}
      footer={!!items.length && footer(totalPages)}
    />
  );
}
