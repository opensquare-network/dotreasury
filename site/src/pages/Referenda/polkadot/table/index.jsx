import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { Table } from "../../../../components/Table";
import TableLoading from "../../../../components/TableLoading";
import Filter from "./filter";
import { useSelector } from "react-redux";
import { chainSelector } from "../../../../store/reducers/chainSlice";
import { polkadotOpenGovReferendumStatusMap } from "../../../../constants";
import Columns from "./columns";
import useSort from "../../../../hooks/useSort";
import useListFilter from "../../../../hooks/applications/polkadot/useFilter";
import { useQuery } from "../../../../utils/hooks";
import Divider from "../../../../components/Divider";
import TableHeader from "./header";
import Card from "../../../../components/Card";
import {
  usePolkadotApplicationsData,
  DISPLAY_TRACKS_ITEMS,
} from "../../../../context/PolkadotApplications";

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
  } = useListFilter();

  const { data: applicationList, isLoading } = usePolkadotApplicationsData();

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

  const filteredData = useMemo(() => {
    const data = dataList.filter((item) => {
      const matchesStatus =
        filterStatus === "-1" || item?.state?.name === filterStatus;

      const matchesTrack = (() => {
        if (filterTrack === "-1") return true;

        if (filterTrack === "others") {
          return !DISPLAY_TRACKS_ITEMS.includes(item?.trackInfo?.name);
        }

        return item?.trackInfo?.name === filterTrack;
      })();

      const matchesAssets = (() => {
        if (filterAssets === "-1") return true;

        if (!Array.isArray(item?.allSpends) && filterAssets === "native") {
          return true;
        }

        if (!Array.isArray(item?.allSpends)) return false;

        return item.allSpends.some((asset) => {
          const currentSymbol = asset?.isSpendLocal
            ? asset?.symbol
            : asset?.assetKind?.symbol;

          return (
            currentSymbol?.toLocaleUpperCase() ===
            filterAssets.toLocaleUpperCase()
          );
        });
      })();

      return matchesStatus && matchesTrack && matchesAssets;
    });

    if (sort === "index_desc") {
      return data.sort((a, b) => {
        return b.referendumIndex - a.referendumIndex;
      });
    }

    return data;
  }, [dataList, filterStatus, filterTrack, filterAssets, sort]);

  const tableData = (filteredData || []).map((item) => ({
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
