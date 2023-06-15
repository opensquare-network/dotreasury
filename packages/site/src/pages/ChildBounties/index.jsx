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
  resetChildBounties,
} from "../../store/reducers/bountySlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { compatChildBountyData } from "./utils";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE, childBountyStatusMap } from "../../constants";
import styled from "styled-components";
import Divider from "../../components/Divider";
import Filter from "../../components/Filter";
import useListFilter from "../../components/Filter/useListFilter";

const QUERY_PAGE_KEY = "page";

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  @media screen and (max-width: 640px) {
    flex-direction: column;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 24px;
`;


const ChildBounties = () => {
  const query = useQuery();
  useChainRoute();

  const searchPage = parseInt(query.get(QUERY_PAGE_KEY) || "1");
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

  useEffect(() => {
    const filterData = getFilterData();
    dispatch(fetchChildBounties(chain, tablePage - 1, pageSize, filterData, sort && { sort }));

    return () => {
      dispatch(resetChildBounties());
    };
  }, [dispatch, chain, tablePage, pageSize, getFilterData, sort]);

  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
  );

  const tableData = useMemo(
    () => childBounties.map(compatChildBountyData),
    [childBounties]
  );

  const header = (
    <div>
      <HeaderWrapper>
        <Nav active="Child Bounties" />
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
          statusMap={childBountyStatusMap}
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
    <ChildBountiesTable
      data={tableData}
      loading={loading}
      header={header}
      footer={footer}
    />
  );
};

export default ChildBounties;
