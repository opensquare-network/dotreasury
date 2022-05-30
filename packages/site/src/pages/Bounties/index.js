// @ts-check
import React, { useEffect, useMemo, useState } from "react";

import Nav from "./Nav";
import Pagination from "./Pagination";
import BountiesTable from "./BountiesTable";
import { useDispatch, useSelector } from "react-redux";
import { useChainRoute, useQuery, useLocalStorage } from "../../utils/hooks";

import {
  fetchBounties,
  loadingSelector,
  bountyListSelector,
} from "../../store/reducers/bountySlice";
import { chainSelector } from "../../store/reducers/chainSlice";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;
const QUERY_PAGE_KEY = "page";

const Bounties = ({ type }) => {
  useChainRoute();

  const searchPage = parseInt(useQuery().get(QUERY_PAGE_KEY));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "bountiesPageSize",
    DEFAULT_PAGE_SIZE
  );

  const dispatch = useDispatch();
  const { items: bounties, total: bountiesTotal } =
    useSelector(bountyListSelector);
  const loading = useSelector(loadingSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchBounties(chain, tablePage - 1, pageSize));
  }, [dispatch, chain, tablePage, pageSize]);

  const totalPages = useMemo(
    () => Math.ceil(bountiesTotal / pageSize),
    [bountiesTotal, pageSize]
  );

  const tableData = useMemo(() => bounties, [bounties]);

  const header = <Nav active="Bounties" />;

  const footer = (
    <Pagination
      page={tablePage}
      setPage={setTablePage}
      totalPages={totalPages}
      pageSize={pageSize}
      setPageSize={setPageSize}
      pageKey={QUERY_PAGE_KEY}
      defaultQueryPage={DEFAULT_QUERY_PAGE}
    />
  );

  return (
    <BountiesTable
      type={type}
      data={tableData}
      loading={loading}
      header={header}
      footer={footer}
    />
  );
};

export default Bounties;
