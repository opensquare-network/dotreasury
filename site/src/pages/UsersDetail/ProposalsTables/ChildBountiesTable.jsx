import { noop } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import ChildBountiesTableOrigin from "../../ChildBounties/ChildBountiesTable";
import {
  fetchChildBounties,
  loadingSelector,
  childBountyListSelector,
} from "../../../store/reducers/bountySlice";
import { useEffect, useMemo } from "react";
import { compatChildBountyData } from "../../ChildBounties/utils";
import { resolveFilterData } from "./resolveFilterData";

export default function ChildBountiesTable({
  header,
  footer = noop,
  tablePage,
  pageSize,
  filterData,
  role,
  address,
}) {
  const dispatch = useDispatch();

  const { items: data, total } = useSelector(childBountyListSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    dispatch(
      fetchChildBounties(
        tablePage - 1,
        pageSize,
        resolveFilterData(filterData, { role, address }),
      ),
    );
  }, [dispatch, tablePage, pageSize, filterData, role, address]);

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
