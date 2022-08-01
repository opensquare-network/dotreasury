// @ts-check
import React, { useEffect, useMemo, useState } from "react";

import Pagination from "../Bounties/Pagination";
import Nav from "../Bounties/Nav";
import ChildBountiesTable from "./ChildBountiesTable";
import { useDispatch, useSelector } from "react-redux";
import { useChainRoute, useQuery, useLocalStorage } from "../../utils/hooks";

import {
  fetchChildBounties,
  childBountyListSelector,
  loadingSelector,
} from "../../store/reducers/bountySlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { compatChildBountyData } from "./utils";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";

const QUERY_PAGE_KEY = "page";

const ChildBounties = () => {
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
  const { items: childBounties, total } = useSelector(childBountyListSelector);
  const loading = useSelector(loadingSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchChildBounties(chain, tablePage - 1, pageSize));
  }, [dispatch, chain, tablePage, pageSize]);

  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
  );

  const tableData = useMemo(
    () => childBounties.map(compatChildBountyData),
    [childBounties]
  );

  const header = <Nav active="Child Bounties" />;

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
    <ChildBountiesTable
      data={tableData}
      loading={loading}
      header={header}
      footer={footer}
    />
  );
};

export default ChildBounties;
