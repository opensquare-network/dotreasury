import { noop } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import BountiesTableOrigin from "../../Bounties/BountiesTable";
import {
  fetchBounties,
  loadingSelector,
  bountyListSelector,
} from "../../../store/reducers/bountySlice";
import { useEffect } from "react";
import { resolveFilterData } from "./resolveFilterData";
import { TableHeaderWrapper } from "./styled";

export default function BountiesTable({
  header,
  footer = noop,
  tablePage,
  pageSize,
  filterData,
  role,
  address,
}) {
  const dispatch = useDispatch();

  const { items, total } = useSelector(bountyListSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    dispatch(
      fetchBounties(
        tablePage - 1,
        pageSize,
        resolveFilterData(filterData, { role, address }),
      ),
    );
  }, [dispatch, tablePage, pageSize, filterData, role, address]);

  return (
    <BountiesTableOrigin
      header={<TableHeaderWrapper>{header}</TableHeaderWrapper>}
      loading={loading}
      data={items}
      footer={!!items.length && footer(totalPages)}
    />
  );
}
