// @ts-check
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Nav from "./Nav";
import Pagination from "./Pagination";
import BountiesTable from "./BountiesTable";
import { useDispatch, useSelector } from "react-redux";
import { useChainRoute, useQuery, useLocalStorage } from "../../utils/hooks";

import {
  fetchBounties,
  loadingSelector,
  bountyListSelector,
  resetBounties,
} from "../../store/reducers/bountySlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import NewBountyButton from "./NewBountyButton";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import useWaitSyncBlock from "../../utils/useWaitSyncBlock";

const QUERY_PAGE_KEY = "page";

const Bounties = () => {
  useChainRoute();

  const searchPage = parseInt(useQuery().get(QUERY_PAGE_KEY) || "1");
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

    return () => {
      dispatch(resetBounties());
    };
  }, [dispatch, chain, tablePage, pageSize]);

  const totalPages = useMemo(
    () => Math.ceil(bountiesTotal / pageSize),
    [bountiesTotal, pageSize]
  );

  const tableData = useMemo(() => bounties, [bounties]);

  const refreshBounties = useCallback(
    (reachingFinalizedBlock) => {
      dispatch(fetchBounties(chain, tablePage - 1, pageSize));
      if (reachingFinalizedBlock) {
        dispatch(newSuccessToast("Sync finished. Please provide context info for your bounty on subsquare or polkassembly."));
      }
    },
    [dispatch, chain, tablePage, pageSize]
  );

  const onFinalized = useWaitSyncBlock("Bounty created", refreshBounties);

  const header = (
    <>
      <Nav active="Bounties" />;
      <div style={{ display: "flex", gap: "16px" }}>
        <NewBountyButton onFinalized={onFinalized} />
      </div>
    </>
  );

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
      data={tableData}
      loading={loading}
      header={header}
      footer={footer}
    />
  );
};

export default Bounties;
