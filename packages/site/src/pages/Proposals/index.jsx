import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import ResponsivePagination from "../../components/ResponsivePagination";
import ProposalsTable from "./ProposalsTable";
import { useDispatch, useSelector } from "react-redux";
import { useChainRoute, useQuery, useLocalStorage } from "../../utils/hooks";
import Summary from "./Summary";
import Filter from "./Filter";

import {
  fetchProposals,
  loadingSelector,
  proposalListSelector,
  resetProposals,
} from "../../store/reducers/proposalSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import Text from "../../components/Text";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import useWaitSyncBlock from "../../utils/useWaitSyncBlock";
import NewProposalButton from "./NewProposalButton";
import { newSuccessToast } from "../../store/reducers/toastSlice";

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
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
    DEFAULT_PAGE_SIZE
  );
  const [filterData, setFilterData] = useState({});
  const sort = query.get("sort");

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: proposals, total } = useSelector(proposalListSelector);
  const loading = useSelector(loadingSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchProposals(chain, tablePage - 1, pageSize, filterData, sort && { sort }));

    return () => {
      dispatch(resetProposals());
    };
  }, [dispatch, chain, tablePage, pageSize, filterData, sort]);

  const totalPages = Math.ceil(total / pageSize);

  const filterQuery = useCallback((data) => {
    setFilterData(data);
    setTablePage(1);
  }, []);

  const refreshProposals = useCallback(
    (reachingFinalizedBlock) => {
      dispatch(fetchProposals(chain, tablePage - 1, pageSize, filterData, sort && { sort }));
      if (reachingFinalizedBlock) {
        dispatch(newSuccessToast("Sync finished. Please provide context info for your proposal on subsquare or polkassembly."));
      }
    },
    [dispatch, chain, tablePage, pageSize, filterData, sort]
  );

  const onFinalized = useWaitSyncBlock("Proposal created", refreshProposals);

  return (
    <>
      <Summary />
      <ProposalsTable
        header={
          <HeaderWrapper>
            <Title>Proposals</Title>
            <div style={{ display: "flex", gap: "16px" }}>
              <NewProposalButton onFinalized={onFinalized} />
              <Filter query={filterQuery} />
            </div>

          </HeaderWrapper>
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
              } else{
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
