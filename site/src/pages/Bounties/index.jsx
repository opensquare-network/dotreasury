// @ts-check
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Nav from "./Nav";
import Pagination from "./Pagination";
import BountiesTable from "./BountiesTable";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useLocalStorage } from "../../utils/hooks";

import {
  fetchBounties,
  loadingSelector,
  bountyListSelector,
  resetBounties,
} from "../../store/reducers/bountySlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_PAGE,
  bountyStatusMap,
} from "../../constants";
import NewBountyButton from "./NewBountyButton";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import useWaitSyncBlock from "../../utils/useWaitSyncBlock";
import Divider from "../../components/Divider";
import Filter from "../../components/Filter";
import useListFilter from "../../components/Filter/useListFilter";
import styled from "styled-components";

const QUERY_PAGE_KEY = "page";

const FilterWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 24px;
`;

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  @media screen and (max-width: 640px) {
    flex-direction: column;
  }
`;

const Bounties = () => {
  const query = useQuery();

  const searchPage = parseInt(query.get(QUERY_PAGE_KEY) || "1");
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "bountiesPageSize",
    DEFAULT_PAGE_SIZE,
  );
  const sort = query.get("sort");

  const {
    filterStatus,
    setFilterStatus,
    rangeType,
    setRangeType,
    min,
    setMin,
    max,
    setMax,
    getFilterData,
  } = useListFilter();

  const dispatch = useDispatch();
  const { items: bounties, total: bountiesTotal } =
    useSelector(bountyListSelector);
  const loading = useSelector(loadingSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    const filterData = getFilterData();
    dispatch(
      fetchBounties(tablePage - 1, pageSize, filterData, sort && { sort }),
    );

    return () => {
      dispatch(resetBounties());
    };
  }, [dispatch, tablePage, pageSize, getFilterData, sort]);

  const totalPages = useMemo(
    () => Math.ceil(bountiesTotal / pageSize),
    [bountiesTotal, pageSize],
  );

  const tableData = useMemo(() => bounties, [bounties]);

  const refreshBounties = useCallback(
    (reachingFinalizedBlock) => {
      const filterData = getFilterData();
      dispatch(
        fetchBounties(tablePage - 1, pageSize, filterData, sort && { sort }),
      );
      if (reachingFinalizedBlock) {
        dispatch(
          newSuccessToast(
            "Sync finished. Please provide context info for your bounty on subsquare or polkassembly.",
          ),
        );
      }
    },
    [dispatch, tablePage, pageSize, getFilterData, sort],
  );

  const onFinalized = useWaitSyncBlock("Bounty created", refreshBounties);

  const header = (
    <div>
      <HeaderWrapper>
        <Nav active="Bounties" />
        <div style={{ display: "flex", gap: "16px" }}>
          <NewBountyButton onFinalized={onFinalized} />
        </div>
      </HeaderWrapper>
      <Divider />
      <FilterWrapper>
        <Filter
          chain={chain}
          status={filterStatus}
          setStatus={setFilterStatus}
          rangeType={rangeType}
          setRangeType={setRangeType}
          min={min}
          setMin={setMin}
          max={max}
          setMax={setMax}
          statusMap={bountyStatusMap}
        />
      </FilterWrapper>
    </div>
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
