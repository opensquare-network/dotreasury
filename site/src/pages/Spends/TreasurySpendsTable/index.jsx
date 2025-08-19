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

const Header = styled.div`
  padding: 24px;
  ${h4_16_semibold}
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px;
`;

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

  table {
    border-radius: 0 !important;
    border: none !important;
  }
`;

export function TreasurySpendsTableOrigin({
  data,
  loading,
  header,
  footer,
  showFilter = false,
}) {
  const [status, setStatus] = useState("");
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

  return (
    <CardWrapper>
      {header}

      {showFilter && (
        <FilterWrapper>
          <TreasurySpendsFilter status={status} setStatus={setStatus} />
        </FilterWrapper>
      )}

      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <Table columns={columns} data={data} />
          </TableLoading>
        </TableWrapper>
      </Wrapper>

      {footer}
    </CardWrapper>
  );
}

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
      fetchTreasurySpendsList(page, pageSize, params, {
        signal: controller.signal,
      }),
    );

    return () => {
      controller.abort();
    };
  }, [dispatch, page, pageSize, sort, getFilterData]);

  const tableData = useMemo(
    () =>
      treasurySpendsList?.items?.map((item) => {
        return {
          ...item,
          proposeAtBlockHeight: item.indexer.blockHeight,
          proposeTime: item.indexer.blockTime,
          state: {
            name: item.state,
          },
        };
      }) || [],
    [treasurySpendsList?.items],
  );

  const handlePageSizeChange = (pageSize) => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete("page");
    history.push({ search: searchParams.toString() });

    setPage(DEFAULT_QUERY_PAGE);
    setPageSize(pageSize);
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

  const header = (
    <>
      <Header>Treasury Spends</Header>
      <Divider />
      <FilterWrapper>
        <TreasurySpendsFilter status={status} setStatus={setStatus} />
      </FilterWrapper>
    </>
  );

  const footer = (
    <ResponsivePagination
      activePage={page}
      pageSize={pageSize}
      totalPages={totalPages}
      setPageSize={handlePageSizeChange}
      onPageChange={handlePageChange}
    />
  );

  return (
    <TreasurySpendsTableOrigin
      data={tableData}
      loading={loadingTreasurySpendsList}
      header={header}
      footer={footer}
      showFilter={false}
    />
  );
}
