import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import Title from "../../components/Title";
import ResponsivePagination from "../../components/ResponsivePagination";
import ProposalsTable from "./ProposalsTable";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "../../utils/hooks";
import Summary from "./Summary";
import Filter from "./Filter";

import {
  fetchProposals,
  loadingSelector,
  proposalListSelector,
} from "../../store/reducers/proposalSlice";

// const Header = styled(Title)`
//   margin-bottom: 20px;
// `;
const HeaderWrapper = styled.div`
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_QUERY_PAGE = 1;

const Proposals = () => {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filterData, setFilterData] = useState({});

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: proposals, total } = useSelector(proposalListSelector);
  const loading = useSelector(loadingSelector);

  useEffect(() => {
    dispatch(fetchProposals(tablePage - 1, pageSize, filterData));
  }, [dispatch, tablePage, pageSize, filterData]);

  const totalPages = Math.ceil(total / pageSize);

  const filterQuery = useCallback((data)=>{
    setFilterData(data);
    setTablePage(1);
  }, []);

  return (
    <>
      <HeaderWrapper>
        <Title>Proposals</Title>
        <Filter query={filterQuery} />
      </HeaderWrapper>
      <Summary />
      <ProposalsTable data={proposals} loading={loading} />
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
              activePage === DEFAULT_QUERY_PAGE ? null : `?page=${activePage}`,
          });
          setTablePage(activePage);
        }}
      />
    </>
  );
};

export default Proposals;
