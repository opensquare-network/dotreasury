import { useDispatch, useSelector } from "react-redux";
import { noop } from "lodash";
import TipsTableOrigin from "../../Tips/TipsTable";
import TipsTableFilter from "../../Tips/Filter";
import {
  fetchTips,
  loadingSelector,
  normalizedTipListSelector,
} from "../../../store/reducers/tipSlice";
import { useEffect } from "react";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { TableHeaderWrapper } from "./styled";
import { resolveFilterData } from "./resolveFilterData";

export default function TipsTable({
  header,
  footer = noop,
  tablePage,
  pageSize,
  filterData,
  filterQuery = noop,
  role,
  address,
}) {
  const chain = useSelector(chainSelector);
  const dispatch = useDispatch();

  const { items, total } = useSelector(normalizedTipListSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    dispatch(
      fetchTips(
        chain,
        tablePage - 1,
        pageSize,
        resolveFilterData(filterData, { role, address })
      )
    );
  }, [dispatch, chain, tablePage, pageSize, filterData, role, address]);

  return (
    <TipsTableOrigin
      header={
        <TableHeaderWrapper>
          {header}
          <TipsTableFilter
            value={filterData?.status || "-1"}
            query={filterQuery}
          />
        </TableHeaderWrapper>
      }
      loading={loading}
      data={items}
      footer={!!items?.length && footer(totalPages)}
    />
  );
}
