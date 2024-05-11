import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import ResponsivePagination from "../../components/ResponsivePagination";
import ProposalsTable from "./ProposalsTable";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useLocalStorage } from "../../utils/hooks";
import Summary from "./Summary";

import {
  failedProposalListSelector,
  failedProposalsLoadingSelector,
  fetchFailedProposals,
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
import { currentChainSettings } from "../../utils/chains";
import Range from "../../components/Filter/Range.jsx";

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

const useQueryTab = () => {
  const query = useQuery();
  return query.get("tab");
};

const TableFilter = ({
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
}) => {
  const tab = useQueryTab();
  const chain = useSelector(chainSelector);

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

  if (currentChainSettings.supportOpenGov) {
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
    } else if (tab === "failed") {
      filter = (
        <Range
          chain={chain}
          rangeType={rangeType}
          setRangeType={setRangeType}
          min={min}
          setMin={setMin}
          max={max}
          setMax={setMax}
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

  return filter;
};

const useListData = () => {
  const tab = useQueryTab();
  const isFailed = tab === "failed";

  const { items: proposals, total } = useSelector(proposalListSelector);
  const loading = useSelector(loadingSelector);

  const { items: failedProposals, total: failedTotal } = useSelector(
    failedProposalListSelector,
  );
  const failedProposalsLoading = useSelector(failedProposalsLoadingSelector);

  if (isFailed) {
    return {
      proposals: failedProposals,
      total: failedTotal,
      loading: failedProposalsLoading,
    };
  }

  return { proposals, total, loading };
};

const Proposals = () => {
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

  const isFailed = tab === "failed";
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
  const { proposals, total, loading } = useListData();

  const doFetchProposal = useCallback(() => {
    let filterData = getFilterData();
    if (isFailed) {
      dispatch(
        fetchFailedProposals(
          tablePage - 1,
          pageSize,
          filterData,
          sort && { sort },
        ),
      );
    } else {
      if (gov) {
        filterData = { ...filterData, gov };
      }
      dispatch(
        fetchProposals(tablePage - 1, pageSize, filterData, sort && { sort }),
      );
    }
  }, [dispatch, tablePage, pageSize, getFilterData, sort, gov, isFailed]);

  useEffect(() => {
    doFetchProposal();
    return () => {
      dispatch(resetProposals());
    };
  }, [dispatch, doFetchProposal]);

  const totalPages = Math.ceil(total / pageSize);

  const refreshProposals = useCallback(
    (reachingFinalizedBlock) => {
      doFetchProposal();
      if (reachingFinalizedBlock) {
        dispatch(
          newSuccessToast(
            "Sync finished. Please provide context info for your proposal on subsquare or polkassembly.",
          ),
        );
      }
    },
    [dispatch, doFetchProposal],
  );

  const onFinalized = useWaitSyncBlock("Proposal created", refreshProposals);

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
            <FilterWrapper>
              <TableFilter
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterTrack={filterTrack}
                setFilterTrack={setFilterTrack}
                rangeType={rangeType}
                setRangeType={setRangeType}
                min={min}
                setMin={setMin}
                max={max}
                setMax={setMax}
              />
            </FilterWrapper>
          </div>
        }
        tab={tab}
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
