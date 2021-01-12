import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import Title from "../../components/Title";
import ResponsivePagination from "../../components/ResponsivePagination";
import ProposalsTable from "./ProposalsTable";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "../../utils/hooks";
import Summary from "./Summary";

import {
  fetchProposals,
  loadingSelector,
  proposalListSelector,
} from "../../store/reducers/proposalSlice";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const DEFAULT_PAGE_SIZE = 20;
const DEDAULT_QUERY_PAGE = 1;

const Proposals = () => {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage = searchPage && !isNaN(searchPage) && searchPage > 0 ? searchPage : DEDAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: proposals, total } = useSelector(proposalListSelector);
  const loading = useSelector(loadingSelector);

  useEffect(() => {
    dispatch(fetchProposals(tablePage - 1, DEFAULT_PAGE_SIZE));
  }, [dispatch, tablePage]);

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  return (
    <>
      <Header>Proposals</Header>
      <ProposalsTable data={proposals} loading={loading} />
      <ResponsivePagination
        activePage={tablePage}
        totalPages={totalPages}
        onPageChange={(_, { activePage }) => {
          history.push({
            search: activePage === DEDAULT_QUERY_PAGE ? null : `?page=${activePage}`
          });
          setTablePage(activePage);
        }}
      />
    </>
  );
};

export default Proposals;
