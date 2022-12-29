import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import Card from "../../components/Card";
import TableHeader from "./TableHeader";
import { useTableColumns } from "../../components/shared/useTableColumns";
import { useDispatch, useSelector } from "react-redux";
import { applicationListSelector, fetchApplicationList } from "../../store/reducers/openGovApplicationsSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useHistory } from "react-router";

const CardWrapper = styled(Card)`
  overflow-x: hidden;
  padding: 0;
  table {
    border-radius: 0 !important;
    border: none !important;
  }
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const Wrapper = styled.div`
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow: scroll;
`;

export default function ReferendaTable() {
  const dispatch = useDispatch();
  const history = useHistory();
  const chain = useSelector(chainSelector);
  const applicationList = useSelector(applicationListSelector);
  const [filterStatus, setFilterStatus] = useState("-1");
  const [filterTrack, setFilterTrack] = useState("-1");
  const [page, setPage] = useState(DEFAULT_QUERY_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const totalPages = Math.ceil((applicationList?.total || 0) / pageSize);

  useEffect(() => {
    const status = filterStatus === "-1" ? "" : filterStatus;
    const track = filterTrack === "-1" ? "" : filterTrack;
    dispatch(fetchApplicationList(chain, page - 1, pageSize, status, track));
  }, [dispatch, chain, page, pageSize, filterStatus, filterTrack]);

  const {
    proposeTime,
    beneficiary,
    proposer,
    value,
    referendaStatus,
  } = useTableColumns({});

  const columns = [
    proposeTime,
    beneficiary,
    proposer,
    value,
    referendaStatus,
  ];

  const listData = (applicationList?.items || []).map(item => (
    {
      proposeAtBlockHeight: item.indexer.blockHeight,
      proposeTime: item.indexer.blockTime,
      beneficiary: item.beneficiary,
      proposer: item.proposer,
      value: item.amount,
      state: item.state,
    }
  ));

  return (
    <CardWrapper>
      <TableHeader setFilterTrack={setFilterTrack} setFilterStatus={setFilterStatus} />
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={false}>
            <Table columns={columns} data={listData} />
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      <ResponsivePagination
        activePage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={(pageSize) => {
          setPage(DEFAULT_QUERY_PAGE);
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
          setPage(activePage);
        }}
      />
    </CardWrapper>
  );
}