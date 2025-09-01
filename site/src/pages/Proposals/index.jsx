import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import ResponsivePagination from "../../components/ResponsivePagination";
import ProposalsTable from "./ProposalsTable";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useLocalStorage } from "../../utils/hooks";
import Summary from "./Summary";
import {
  fetchProposals,
  loadingSelector,
  proposalListSelector,
  resetProposals,
} from "../../store/reducers/proposalSlice";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import Divider from "../../components/Divider";
import useListFilter from "../../components/OpenGovFilter/useListFilter";
import TableHeader from "./TableHeader";
import TableFilter from "./TableFilter";

const useListData = () => {
  const { items: proposals, total } = useSelector(proposalListSelector);
  const loading = useSelector(loadingSelector);

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

  const {
    filterStatus,
    setFilterStatus,
    filterTrack,
    setFilterTrack,
    getFilterData,
  } = useListFilter();

  const dispatch = useDispatch();
  const history = useHistory();
  const { proposals, total, loading } = useListData();

  const doFetchProposal = useCallback(
    (options = {}) => {
      let filterData = getFilterData();

      const params = {
        ...filterData,
      };
      if (sort) {
        params.sort = sort;
      }

      dispatch(fetchProposals(tablePage - 1, pageSize, params, options));
    },
    [dispatch, tablePage, pageSize, getFilterData, sort],
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete("page");
    history.push({ search: searchParams.toString() });

    setTablePage(DEFAULT_QUERY_PAGE);
  }, [getFilterData, history]);

  useEffect(() => {
    const controller = new AbortController();
    doFetchProposal({ signal: controller.signal });
    return () => {
      controller.abort();
      dispatch(resetProposals());
    };
  }, [dispatch, doFetchProposal]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <Summary />
      <ProposalsTable
        header={
          <div>
            <TableHeader />
            <Divider />
            <TableFilter
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterTrack={filterTrack}
              setFilterTrack={setFilterTrack}
            />
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
