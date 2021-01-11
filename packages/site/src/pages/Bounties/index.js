import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Title from "../../components/Title";
import ResponsivePagination from "../../components/ResponsivePagination";
import BountiesTable from "./BountiesTable";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "../../utils/hooks";
import { useHistory } from "react-router";

import {
  fetchBounties,
  loadingSelector,
  bountyListSelector,
} from "../../store/reducers/bountySlice";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const DEFAULT_PAGE_SIZE = 20;
const DEDAULT_QUERY_PAGE = 1;

const Bounties = () => {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage = searchPage && !isNaN(searchPage) && searchPage > 0 ? searchPage : DEDAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: bounties, total } = useSelector(bountyListSelector);
  const loading = useSelector(loadingSelector);

  useEffect(() => {
    dispatch(fetchBounties(tablePage - 1, DEFAULT_PAGE_SIZE));
  }, [dispatch, tablePage]);

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  return (
    <>
      <Header>Bounties</Header>
      <BountiesTable data={bounties} loading={loading} />
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

export default Bounties;
