import styled from "styled-components";
import Card from "../../../components/Card";
import { h4_16_semibold } from "../../../styles/text";
import Divider from "../../../components/Divider";
import { Table } from "../../../components/Table";
import TableLoading from "../../../components/TableLoading";
import ResponsivePagination from "../../../components/ResponsivePagination";
import { useState } from "react";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../../constants";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTreasurySpendsList,
  loadingTreasurySpendsListSelector,
  treasurySpendsListSelector,
} from "../../../store/reducers/treasurySpendsSlice";
import { useQuery } from "../../../utils/hooks";
import { useTableColumns } from "../../../components/shared/useTableColumns";
import TreasurySpendsFilter from "../../../components/TreasurySpendsFilter";
import { useTreasurySpendsFilter } from "../../../components/TreasurySpendsFilter/useListFilter";
import { useEffect } from "react";
import { treasurySpendsLinkToSubSquareColumn } from "./LinkToSubSquareColumn";
import { treasurySpendsIndexColumn } from "./IndexColumn";
import { treasurySpendsDescriptionColumn } from "./DescriptionColumn";
import { useTreasurySpendsSortByValueColumn } from "./SortByValueColumn";
import { useMemo } from "react";
import dayjs from "dayjs";

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

  const { status, setStatus, getFilterData } = useTreasurySpendsFilter();

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete("page");
    history.push({ search: searchParams.toString() });

    setPage(DEFAULT_QUERY_PAGE);
  }, [getFilterData, history]);

  useEffect(() => {
    const filterData = getFilterData();
    const controller = new AbortController();

    const params = {
      ...filterData,
    };
    if (sort) {
      params.sort = sort;
    }

    dispatch(
      fetchTreasurySpendsList(page - 1, pageSize, params, {
        signal: controller.signal,
      }),
    );

    return () => {
      controller.abort();
    };
  }, [dispatch, page, pageSize, sort, getFilterData]);

  const { proposeTime, proposer, referendaStatus } = useTableColumns({});

  const sortByValue = useTreasurySpendsSortByValueColumn();

  const columns = [
    treasurySpendsIndexColumn,
    proposeTime,
    proposer,
    treasurySpendsDescriptionColumn,
    sortByValue,
    referendaStatus,
    treasurySpendsLinkToSubSquareColumn,
  ];

  const tableData = useMemo(
    () =>
      treasurySpendsList?.items?.map((item) => {
        return {
          ...item,
          proposeAtBlockHeight: item.indexer.blockHeight,
          proposeTime: item.indexer.blockTime,
          state: {
            name: item.state,
            indexer: {
              blockTime: dayjs(item.lastActivityAt).valueOf(),
            },
          },
        };
      }) || [],
    [treasurySpendsList?.items],
  );

  return (
    <Card>
      <Header>Treasury Spends</Header>

      <Divider />

      <FilterWrapper>
        <TreasurySpendsFilter status={status} setStatus={setStatus} />
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
