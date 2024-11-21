import styled from "styled-components";
import Card from "../../../components/Card";
import { h4_16_semibold } from "../../../styles/text";
import Divider from "../../../components/Divider";
import { Table } from "../../../components/Table";
import TableLoading from "../../../components/TableLoading";
import ResponsivePagination from "../../../components/ResponsivePagination";
import { useState } from "react";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_PAGE,
  treasuryProposalStatusMap,
  treasurySpendStatusMap,
  treasuryTipStatusMap,
} from "../../../constants";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTreasurySpendsList,
  loadingTreasurySpendsListSelector,
  treasurySpendsListSelector,
} from "../../../store/reducers/treasurySpendsSlice";
import { useQuery } from "../../../utils/hooks";
import { useTableColumns } from "../../../components/shared/useTableColumns";
import { currentChain } from "../../../utils/chains";
import TreasurySpendsFilter from "../../../components/TreasurySpendsFilter";
import { useTreasurySpendsFilter } from "../../../components/TreasurySpendsFilter/useListFilter";
import { useEffect } from "react";
import { treasurySpendsLinkToSubSquareColumn } from "./LinkToSubSquareColumn";
import { treasurySpendsIndexColumn } from "./IndexColumn";
import { treasurySpendsDescriptionColumn } from "./DescriptionColumn";
import { useTreasurySpendsSortByValueColumn } from "./SortByValueColumn";

const Header = styled.div`
  padding: 24px;
  ${h4_16_semibold}
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px;
`;

const TableWrapper = styled.div`
  overflow: scroll;

  table {
    border-radius: 0 !important;
    border: none !important;
  }
`;

export default function TreasurySpendsTable() {
  const [page, setPage] = useState(DEFAULT_QUERY_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const treasurySpendsList = useSelector(treasurySpendsListSelector);
  const loadingTreasurySpendsList = useSelector(
    loadingTreasurySpendsListSelector,
  );
  const totalPages = Math.ceil((treasurySpendsList?.total || 0) / pageSize);
  const history = useHistory();
  const query = useQuery();
  const sort = query.get("sort");
  const dispatch = useDispatch();

  const {
    filterStatus,
    setFilterStatus,
    filterAsset,
    setFilterAsset,
    min,
    setMin,
    max,
    setMax,
    getFilterData,
  } = useTreasurySpendsFilter();

  useEffect(() => {
    const filterData = getFilterData();

    dispatch(
      fetchTreasurySpendsList(page - 1, pageSize, filterData, sort && { sort }),
    );
  }, [dispatch, page, pageSize, sort, getFilterData]);

  const { proposeTime, beneficiary, referendaStatus } = useTableColumns({});

  const sortByValue = useTreasurySpendsSortByValueColumn();

  const columns = [
    treasurySpendsIndexColumn,
    proposeTime,
    beneficiary,
    treasurySpendsDescriptionColumn,
    sortByValue,
    referendaStatus,
    treasurySpendsLinkToSubSquareColumn,
  ];

  const tableData = (treasurySpendsList?.items || []).map((item) => {
    return {
      ...item,
      proposeAtBlockHeight: item.indexer.blockHeight,
      proposeTime: item.indexer.blockTime,
    };
  });

  return (
    <Card>
      <Header>Treasury Spends</Header>

      <Divider />

      <FilterWrapper>
        <TreasurySpendsFilter
          chain={currentChain}
          status={filterStatus}
          setStatus={setFilterStatus}
          asset={filterAsset}
          setAsset={setFilterAsset}
          min={min}
          setMin={setMin}
          max={max}
          setMax={setMax}
          statusMap={{
            ...treasurySpendStatusMap,
            ...treasuryProposalStatusMap,
            ...treasuryTipStatusMap,
          }}
        />
      </FilterWrapper>

      <TableWrapper>
        <TableLoading loading={loadingTreasurySpendsList}>
          <Table columns={columns} data={tableData} />
        </TableLoading>
      </TableWrapper>

      <ResponsivePagination
        activePage={page}
        pageSize={pageSize}
        totalPages={totalPages}
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
    </Card>
  );
}
