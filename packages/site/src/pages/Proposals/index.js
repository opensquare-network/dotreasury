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
} from "../../store/reducers/proposalSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import Text from "../../components/Text";

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

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;

const Proposals = () => {
  useChainRoute();

  const searchPage = parseInt(useQuery().get("page"));
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

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: proposals, total } = useSelector(proposalListSelector);
  const loading = useSelector(loadingSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchProposals(chain, tablePage - 1, pageSize, filterData));
  }, [dispatch, chain, tablePage, pageSize, filterData]);

  const totalPages = Math.ceil(total / pageSize);

  const filterQuery = useCallback((data) => {
    setFilterData(data);
    setTablePage(1);
  }, []);

  return (
    <>
      <Summary />
      <ProposalsTable
        header={
          <HeaderWrapper>
            <Title>Proposals</Title>
            <Filter query={filterQuery} />
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
              setTablePage(DEFAULT_QUERY_PAGE);
              setPageSize(pageSize);
              history.push({
                search: null,
              });
            }}
            onPageChange={(_, { activePage }) => {
              history.push({
                search:
                  activePage === DEFAULT_QUERY_PAGE
                    ? null
                    : `?page=${activePage}`,
              });
              setTablePage(activePage);
            }}
          />
        }
      />
    </>
  );
};

export default Proposals;
