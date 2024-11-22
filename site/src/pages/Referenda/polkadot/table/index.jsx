import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "../../../../components/Table";
import TableLoading from "../../../../components/TableLoading";
import Filter from "./filter";
import ResponsivePagination from "../../../../components/ResponsivePagination";
import { useSelector } from "react-redux";
import { chainSelector } from "../../../../store/reducers/chainSlice";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_PAGE,
  polkadotOpenGovReferendumStatusMap,
} from "../../../../constants";
import Columns from "./columns";
import { useHistory } from "react-router";
import useSort from "../../../../hooks/useSort";
import useListFilter from "../../../../hooks/applications/polkadot/useFilter";
import { useQuery } from "../../../../utils/hooks";
import useFetchReferendumsList from "../../../../hooks/applications/polkadot/useFetchReferendumsList";
import Divider from "../../../../components/Divider";
import TableHeader from "./header";
import Card from "../../../../components/Card";

const TableWrapper = styled.div`
  overflow: scroll;
`;

const CardWrapper = styled(Card)`
  padding: 0;
  table {
    border-radius: 0 !important;
    border: none !important;
  }
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

export default function ReferendaTable() {
  const history = useHistory();
  const chain = useSelector(chainSelector);
  const [page, setPage] = useState(DEFAULT_QUERY_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const query = useQuery();
  const sort = query.get("sort");
  const [dataList, setDataList] = useState([]);

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

  const filterData = getFilterData();
  const { data: applicationList, isLoading } = useFetchReferendumsList(
    filterData,
    sort && { sort },
  );

  const totalPages = Math.ceil((applicationList?.total || 0) / pageSize);

  const currentData = applicationList.items.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    if (!isLoading) {
      setDataList(currentData);
    }
  }, [applicationList, isLoading, page, pageSize]);

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

  const handlePageSizeChange = (newPageSize) => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete("page");
    history.push({ search: searchParams.toString() });

    setPage(DEFAULT_QUERY_PAGE);
    setPageSize(newPageSize);
  };

  const handlePageChange = (_, { activePage }) => {
    const searchParams = new URLSearchParams(history.location.search);
    if (activePage === DEFAULT_QUERY_PAGE) {
      searchParams.delete("page");
    } else {
      searchParams.set("page", activePage);
    }
    history.push({ search: searchParams.toString() });

    setPage(activePage);
  };

  return (
    <CardWrapper>
      <TableHeader />
      <Divider />
      <div>
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
          <TableLoading loading={isLoading}>
            <Table columns={columns} data={tableData} />
          </TableLoading>
        </TableWrapper>
      </div>
      <ResponsivePagination
        activePage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        onPageChange={handlePageChange}
      />
    </CardWrapper>
  );
}
