import { noop } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { resolveFilterData } from "./resolveFilterData";
import ProposalsTableOrigin from "../../Proposals/ProposalsTable";
import { useEffect } from "react";
import {
  fetchProposals,
  loadingSelector,
  proposalListSelector,
} from "../../../store/reducers/proposalSlice";
import { TableHeaderWrapper } from "./styled";

export default function ProposalsTable({
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

  const { items, total } = useSelector(proposalListSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    dispatch(
      fetchProposals(
        chain,
        tablePage - 1,
        pageSize,
        resolveFilterData(filterData, { role, address })
      )
    );
  }, [dispatch, chain, tablePage, pageSize, filterData, role, address]);

  return (
    <ProposalsTableOrigin
      header={<TableHeaderWrapper>{header}</TableHeaderWrapper>}
      loading={loading}
      data={items}
      footer={!!items.length && footer(totalPages)}
    />
  );
}
