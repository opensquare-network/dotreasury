import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import Card from "../../components/Card";
import TableHeader from "./TableHeader";
import { useTableColumns } from "../../components/shared/useTableColumns";
import { useDispatch, useSelector } from "react-redux";
import { applicationListSelector, fetchApplicationList, loadingApplicationListSelector } from "../../store/reducers/openGovApplicationsSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useHistory } from "react-router";
import api from "../../services/scanApi";
import TextMinor from "../../components/TextMinor";
import JumpToLink from "./Link";
import DescriptionCell from "../Proposals/DescriptionCell";
import Filter from "./Filter";
import Divider from "../../components/Divider";

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
  const [filterStatus, setFilterStatus] = useState("-1");
  const [filterTrack, setFilterTrack] = useState("-1");
  const [rangeType, setRangeType] = useState("range-by-asset");
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [page, setPage] = useState(DEFAULT_QUERY_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const totalPages = Math.ceil((applicationList?.total || 0) / pageSize);

  useEffect(() => {
    const status = filterStatus === "-1" ? "" : filterStatus;
    const track = filterTrack === "-1" ? "" : filterTrack;
    dispatch(fetchApplicationList(chain, page - 1, pageSize, status, track));
  }, [dispatch, chain, page, pageSize, filterStatus, filterTrack]);

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

  const columns = [
    index,
    proposeTime,
    beneficiary,
    description,
    value,
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
            setTrack={setFilterTrack}
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
