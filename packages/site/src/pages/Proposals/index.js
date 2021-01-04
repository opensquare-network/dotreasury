import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Title from "../../components/Title";
import ResponsivePagination from "../../components/ResponsivePagination";
import ProposalsTable from "./ProposalsTable";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProposals,
  loadingSelector,
  proposalListSelector,
} from "../../store/reducers/proposalSlice";

const Header = styled(Title)`
  margin-bottom: 20px;
`;

const DEFAULT_PAGE_SIZE = 20;

const Proposals = () => {
  const [tablePage, setTablePage] = useState(1);

  const dispatch = useDispatch();
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
          setTablePage(activePage);
        }}
      />
    </>
  );
};

export default Proposals;
