import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import ResponsivePagination from "../../components/ResponsivePagination";
import ProposalsTable from "./ProposalsTable";
import { useDispatch, useSelector } from "react-redux";
import { useChainRoute, useQuery, useLocalStorage } from "../../utils/hooks";
import Summary from "./Summary";

import {
  fetchProposals,
  loadingSelector,
  proposalListSelector,
  resetProposals,
} from "../../store/reducers/proposalSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_PAGE,
  gov2ProposalStatusMap,
  proposalStatusMap,
} from "../../constants";
import useWaitSyncBlock from "../../utils/useWaitSyncBlock";
import NewProposalButton from "./NewProposalButton";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import Divider from "../../components/Divider";
import useListFilter from "../../components/OpenGovFilter/useListFilter";
import Filter from "../../components/Filter";
import OpenGovFilter from "../../components/OpenGovFilter";
import Nav from "./Nav";

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 24px;
`;

const Proposals = () => {
  useChainRoute();
  const query = useQuery();

  const searchPage = parseInt(query.get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "proposalsPageSize",
    DEFAULT_PAGE_SIZE,
  );
  const sort = query.get("sort");
  const tab = query.get("tab");

  const gov = tab === "gov1" ? "1" : tab === "opengov" ? "2" : "";

  const {
    filterStatus,
    setFilterStatus,
    filterTrack,
    setFilterTrack,
    rangeType,
    setRangeType,
    min,
    setMin,
    max,
    setMax,
    getFilterData,
  } = useListFilter();

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: proposals, total } = useSelector(proposalListSelector);
  const loading = useSelector(loadingSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    let filterData = getFilterData();
    if (gov) {
      filterData = { ...filterData, gov };
    }

    dispatch(
      fetchProposals(
        chain,
        tablePage - 1,
        pageSize,
        filterData,
        sort && { sort },
      ),
    );

    return () => {
      dispatch(resetProposals());
    };
  }, [dispatch, chain, tablePage, pageSize, getFilterData, sort, gov]);

  const totalPages = Math.ceil(total / pageSize);

  const refreshProposals = useCallback(
    (reachingFinalizedBlock) => {
      let filterData = getFilterData();
      if (gov) {
        filterData = { ...filterData, gov };
      }

      dispatch(
        fetchProposals(
          chain,
          tablePage - 1,
          pageSize,
          filterData,
          sort && { sort },
        ),
      );
      if (reachingFinalizedBlock) {
        dispatch(
          newSuccessToast(
            "Sync finished. Please provide context info for your proposal on subsquare or polkassembly.",
          ),
        );
      }
    },
    [dispatch, chain, tablePage, pageSize, getFilterData, sort, gov],
  );

  const onFinalized = useWaitSyncBlock("Proposal created", refreshProposals);

  let filter = (
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
      statusMap={{ ...proposalStatusMap, ...gov2ProposalStatusMap }}
    />
  );

  if (chain === "kusama") {
    if (tab === "opengov") {
      filter = (
        <OpenGovFilter
          chain={chain}
          status={filterStatus}
          setStatus={setFilterStatus}
          track={filterTrack}
          setTrack={setFilterTrack}
          rangeType={rangeType}
          setRangeType={setRangeType}
          min={min}
          setMin={setMin}
          max={max}
          setMax={setMax}
          statusMap={gov2ProposalStatusMap}
        />
      );
    } else if (!tab) {
      filter = (
        <OpenGovFilter
          chain={chain}
          status={filterStatus}
          setStatus={setFilterStatus}
          track={filterTrack}
          setTrack={setFilterTrack}
          rangeType={rangeType}
          setRangeType={setRangeType}
          min={min}
          setMin={setMin}
          max={max}
          setMax={setMax}
          statusMap={proposalStatusMap}
        />
      );
    }
  }

  return (
    <>
      <Summary />
      <ProposalsTable
        header={
          <div>
            <HeaderWrapper>
              <Nav active="All" />
              <div style={{ display: "flex", gap: "16px" }}>
                <NewProposalButton onFinalized={onFinalized} />
              </div>
            </HeaderWrapper>
            <Divider />
            <FilterWrapper>{filter}</FilterWrapper>
          </div>
        }
        data={proposals}
        loading={loading}
        footer={
          <ResponsivePagination
            activePage={tablePage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={(pageSize) => {
              const searchParams = new URLSearchParams(history.location.search);
              searchParams.delete("page");
              history.push({ search: searchParams.toString() });

              setTablePage(DEFAULT_QUERY_PAGE);
              setPageSize(pageSize);
            }}
            onPageChange={(_, { activePage }) => {
              const searchParams = new URLSearchParams(history.location.search);
              if (activePage === DEFAULT_QUERY_PAGE) {
                searchParams.delete("page");
              } else {
                searchParams.set("page", activePage);
              }
              history.push({ search: searchParams.toString() });

              setTablePage(activePage);
            }}
          />
        }
      />
    </>
  );
};

export default Proposals;
