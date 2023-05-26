import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import Card from "../../components/Card";
import TableHeader from "./TableHeader";
import { useTableColumns } from "../../components/shared/useTableColumns";
import { useDispatch, useSelector } from "react-redux";
import { applicationListSelector, fetchApplicationList, loadingApplicationListSelector } from "../../store/reducers/openGovApplicationsSlice";
import { chainSelector, chainSymbolSelector } from "../../store/reducers/chainSlice";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useHistory } from "react-router";
import api from "../../services/scanApi";
import TextMinor from "../../components/TextMinor";
import JumpToLink from "./Link";
import DescriptionCell from "../Proposals/DescriptionCell";
import Filter, { RangeTypes } from "./Filter";
import Divider from "../../components/Divider";
import isEmpty from "lodash.isempty";
import useListFilter from "./useListFilter";
import SortableValue from "../../components/SortableValue";
import useSort from "../../hooks/useSort";
import SortableIndex from "../../components/SortableIndex";
import { useQuery } from "../../utils/hooks";
import { getPrecision } from "../../utils";
import BigNumber from "bignumber.js";

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
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  const {
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
  } = useSort();

  const {
    filterStatus,
    setFilterStatus,
    filterTrack,
    setFilterTrack,
    rangeType,
    setRangeType,
    min,
    setMin,
    max,
    setMax,
  } = useListFilter();

  useEffect(() => {
    const status = filterStatus === "-1" ? "" : filterStatus;
    const track = filterTrack === "-1" ? "" : filterTrack;
    let minMax = {};
    if (rangeType === RangeTypes.Token) {
      if (min) minMax.min = new BigNumber(min).times(Math.pow(10, precision)).toString();
      if (max) minMax.max = new BigNumber(max).times(Math.pow(10, precision)).toString();
    } else {
      if (min) minMax.min = min;
      if (max) minMax.max = max;
    }
    if (!isEmpty(minMax)) minMax.rangeType = rangeType;
    dispatch(fetchApplicationList(chain, page - 1, pageSize, status, track, minMax, sort && { sort }));
  }, [dispatch, chain, page, pageSize, filterStatus, filterTrack, rangeType, min, max, sort, precision]);

  useEffect(() => {
    setDataList(applicationList?.items || []);

    const dataListPromises = (applicationList?.items || [])
      .map(async (item) => {
        if (item.description) {
          return item;
        }

        const description = await fetchGov2ReferendaTitle(chain, item.referendumIndex);
        return { ...item, description };
      });

    Promise.all(dataListPromises).then(dataList => setDataList(dataList));
  }, [chain, applicationList]);

  const {
    proposeTime,
    beneficiary,
    value,
    referendaStatus,
  } = useTableColumns({});

  const index = {
    key: "index",
    title: "Index",
    dataIndex: "referendumIndex",
    cellClassName: "index-cell",
    cellRender: (value) => <TextMinor>#{value}</TextMinor>,
  };

  const description = {
    key: "description",
    title: "Description",
    cellClassName: "opengov-description-cell",
    cellRender: (_, item) => (
      <DescriptionCell
        description={item.description}
        trackInfo={item.trackInfo}
      />
    ),
  };

  const linkToSubSquare = {
    key: "link-to-subsquare",
    title: "",
    headerCellClassName: "hidden",
    cellClassName: "link-cell hidden",
    cellRender: (_, item) => <JumpToLink href={`https://${chain}.subsquare.io/referenda/referendum/${item.referendumIndex}`} />,
  };

  const sortByValue = {
    ...value,
    title: (
      <SortableValue
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
    ),
  };

  const sortableProposalIndex = {
    ...index,
    title: (
      <SortableIndex
        direction={sortField === "index" ? sortDirection : ""}
        onClick={() => {
          setSortField("index");
          setSortDirection(sortField === "index" && sortDirection === "asc" ? "desc" : "asc");
        }}
      />
    ),
  };

  const columns = [
    sortableProposalIndex,
    proposeTime,
    beneficiary,
    description,
    sortByValue,
    referendaStatus,
    linkToSubSquare,
  ];

  const tableData = (dataList || []).map(item => (
    {
      referendumIndex: item.referendumIndex,
      proposeAtBlockHeight: item.indexer.blockHeight,
      proposeTime: item.indexer.blockTime,
      beneficiary: item.beneficiary,
      proposer: item.proposer,
      value: item.amount,
      symbolPrice: item.symbolPrice,
      state: item.state,
      description: item.description,
      trackInfo: item.trackInfo,
    }
  ));

  return (
    <CardWrapper>
      <TableHeader />
      <Divider />
      <Wrapper>
        <div style={{ display: "flex", padding: "24px", gap: "16px" }}>
          <Filter
            chain={chain}
            track={filterTrack}
            setTrack={setFilterTrack}
            status={filterStatus}
            setStatus={setFilterStatus}
            rangeType={rangeType}
            setRangeType={setRangeType}
            min={min}
            setMin={setMin}
            max={max}
            setMax={setMax}
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
          } else{
            searchParams.set("page", activePage);
          }
          history.push({ search: searchParams.toString() });

          setPage(activePage);
        }}
      />
    </CardWrapper>
  );
}
