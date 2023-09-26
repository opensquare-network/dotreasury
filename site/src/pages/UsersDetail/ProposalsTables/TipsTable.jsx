import { useDispatch, useSelector } from "react-redux";
import { noop } from "lodash";
import TipsTableOrigin from "../../Tips/TipsTable";
import {
  fetchTips,
  loadingSelector,
  normalizedTipListSelector,
} from "../../../store/reducers/tipSlice";
import { useEffect } from "react";
import { TableHeaderWrapper } from "./styled";
import { resolveFilterData } from "./resolveFilterData";

export default function TipsTable({
  header,
  footer = noop,
  tablePage,
  pageSize,
  filterData,
  role,
  address,
}) {
  const dispatch = useDispatch();

  const { items, total } = useSelector(normalizedTipListSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    dispatch(
      fetchTips(
        tablePage - 1,
        pageSize,
        resolveFilterData(filterData, { role, address }),
      ),
    );
  }, [dispatch, tablePage, pageSize, filterData, role, address]);

  return (
    <TipsTableOrigin
      header={<TableHeaderWrapper>{header}</TableHeaderWrapper>}
      loading={loading}
      data={items}
      footer={!!items?.length && footer(totalPages)}
    />
  );
}
