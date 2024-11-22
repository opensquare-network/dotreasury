import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "../../../../components/Table";
import TableLoading from "../../../../components/TableLoading";
import Filter from "./filter";
import { useSelector } from "react-redux";
import { chainSelector } from "../../../../store/reducers/chainSlice";
import { polkadotOpenGovReferendumStatusMap } from "../../../../constants";
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

  useEffect(() => {
    if (!isLoading) {
      setDataList(applicationList?.items || []);
    }
  }, [applicationList, isLoading]);

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
    </CardWrapper>
  );
}
