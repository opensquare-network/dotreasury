import styled from "styled-components";
import Card from "../../components/Card";
import { h4_16_semibold, p_12_medium } from "../../styles/text";
import Divider from "../../components/Divider";
import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useState } from "react";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_PAGE,
  treasurySpendsStatusMap,
} from "../../constants";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTreasurySpendsList,
  loadingTreasurySpendsListSelector,
  treasurySpendsListSelector,
} from "../../store/reducers/treasurySpendsSlice";
import { useEffect } from "react";
import { useQuery } from "../../utils/hooks";
import { useTableColumns } from "../../components/shared/useTableColumns";
import JumpToLink from "../Referenda/Link";
import { currentChain } from "../../utils/chains";
import SortableValue from "../../components/SortableValue";
import useSort from "../../hooks/useSort";
import DescriptionCell from "../Proposals/DescriptionCell";
import TextMinor from "../../components/TextMinor";
import TreasurySpendsFilter from "../../components/TreasurySpendsFilter";
import { useTreasurySpendsFilter } from "../../components/TreasurySpendsFilter/useListFilter";
import ValueDisplay from "../../components/ValueDisplay";
import { space_y } from "../../styles/tailwindcss";

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

const ValueCellWrapper = styled.div`
  ${space_y(2)}
`;
const ValueDisplayWrapper = styled.div`
  color: var(--textPrimary);
`;
const ValueDisplayFiatWrapper = styled.div`
  ${p_12_medium}
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

  const { sortField, setSortField, sortDirection, setSortDirection } =
    useSort();

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

  const { proposeTime, beneficiary, value, referendaStatus } = useTableColumns(
    {},
  );

  const index = {
    key: "index",
    title: "Index",
    dataIndex: "index",
    cellClassName: "index-cell",
    cellRender(value) {
      return <TextMinor>#{value}</TextMinor>;
    },
  };

  const description = {
    key: "description",
    title: "Description",
    dataIndex: "description",
    cellClassName: "opengov-description-cell",
    cellRender(_, item) {
      return (
        <DescriptionCell
          description={item.title}
          tags={{ proposalType: item.type }}
        />
      );
    },
  };

  const sortByValue = {
    ...value,
    cellClassName: "treasury-spends-value-cell",
    title: (
      <SortableValue
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
    ),
    cellRender(_, item) {
      const asset = item?.assetType;
      if (!asset) {
        return null;
      }

      return (
        <ValueCellWrapper>
          <ValueDisplayWrapper>
            <ValueDisplay value={item.value} precision={asset?.decimals} />{" "}
            {asset.symbol}
          </ValueDisplayWrapper>
          {!!item.fiatValue && (
            <ValueDisplayFiatWrapper>
              <ValueDisplay value={item.fiatValue} prefix="$" />
            </ValueDisplayFiatWrapper>
          )}
        </ValueCellWrapper>
      );
    },
  };

  const linkToSubSquare = {
    key: "link-to-subsquare",
    title: "",
    headerCellClassName: "hidden",
    cellClassName: "link-cell hidden",
    cellRender: (_, item) => (
      <JumpToLink
        href={`https://${currentChain}.subsquare.io/referenda/referendum/${item.index}`}
      />
    ),
  };

  const columns = [
    index,
    proposeTime,
    beneficiary,
    description,
    sortByValue,
    referendaStatus,
    linkToSubSquare,
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
          statusMap={treasurySpendsStatusMap}
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
