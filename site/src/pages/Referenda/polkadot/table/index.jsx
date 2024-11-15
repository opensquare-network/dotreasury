import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "../../../../components/Table";
import TableLoading from "../../../../components/TableLoading";
import Filter from "../filter";
import ResponsivePagination from "../../../../components/ResponsivePagination";
import { useDispatch, useSelector } from "react-redux";
import {
  applicationListSelector,
  fetchApplicationList,
  loadingApplicationListSelector,
} from "../../../../store/reducers/openGovApplicationsSlice";
import { chainSelector } from "../../../../store/reducers/chainSlice";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_PAGE,
  polkadotOpenGovReferendumStatusMap,
} from "../../../../constants";
import Columns from "./columns";
import { useHistory } from "react-router";
import api from "../../../../services/scanApi";
import useSort from "../../../../hooks/useSort";
import useListFilter from "../filter/useFilter";
import { useQuery } from "../../../../utils/hooks";

const Wrapper = styled.div``;

const TableWrapper = styled.div`
  overflow: scroll;
`;

const fetchGov2ReferendaTitle = async (chain, referendumIndex) => {
  const apiUrl = `https://${chain}.subsquare.io/api/gov2/referendums/${referendumIndex}`;
  const { result } = await api.fetch(apiUrl);
  return result?.title || "";
};

export default function ReferendaTable() {
  const dispatch = useDispatch();
  const history = useHistory();
  const chain = useSelector(chainSelector);
  const applicationList = useSelector(applicationListSelector);
  const applicationListLoading = useSelector(loadingApplicationListSelector);
  const [dataList, setDataList] = useState(applicationList?.items || []);
  const [page, setPage] = useState(DEFAULT_QUERY_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const totalPages = Math.ceil((applicationList?.total || 0) / pageSize);
  const query = useQuery();
  const sort = query.get("sort");

  const { sortField, setSortField, sortDirection, setSortDirection } =
    useSort();

  const {
    filterStatus,
    setFilterStatus,
    filterTrack,
    setFilterTrack,
    filterAssets,
    setFilterAssets,
    getFilterData,
  } = useListFilter();

  useEffect(() => {
    const filterData = getFilterData();
    dispatch(
      fetchApplicationList(page - 1, pageSize, filterData, sort && { sort }),
    );
  }, [dispatch, page, pageSize, sort, getFilterData]);

  useEffect(() => {
    setDataList(applicationList?.items || []);
  }, [applicationList]);

  const columns = Columns({
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    chain,
  });

  const tableData = (dataList || []).map((item) => ({
    ...item,
    referendumIndex: item.referendumIndex,
    proposeAtBlockHeight: item.indexer.blockHeight,
    proposeTime: item.indexer.blockTime,
    value: item.amount,
    symbolPrice: item.symbolPrice,
    state: item.state,
    description: item.description,
    trackInfo: item.trackInfo,
  }));

  return (
    <>
      <Wrapper>
        <div style={{ display: "flex", padding: "24px", gap: "16px" }}>
          <Filter
            track={filterTrack}
            setTrack={setFilterTrack}
            assets={filterAssets}
            setAssets={setFilterAssets}
            status={filterStatus}
            setStatus={setFilterStatus}
            statusMap={polkadotOpenGovReferendumStatusMap}
          />
        </div>
        <TableWrapper>
          <TableLoading loading={applicationListLoading}>
            <Table columns={columns} data={tableData} />
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      <ResponsivePagination
        activePage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={(pageSize) => {
          const searchParams = new URLSearchParams(history.location.search);
          searchParams.delete("page");
          history.push({ search: searchParams.toString() });

          setPage(DEFAULT_QUERY_PAGE);
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

          setPage(activePage);
        }}
      />
    </>
  );
}
