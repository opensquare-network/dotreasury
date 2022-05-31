import React from "react";
import styled from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import dayjs from "dayjs";

import { Table } from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import User from "../../components/User";
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import TableNoDataCell from "../../components/TableNoDataCell";
import PolygonLabel from "../../components/PolygonLabel";
import ExplorerLink from "../../components/ExplorerLink";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import Card from "../../components/Card";
import { compatChildBountyData } from "../ChildBounties/utils";

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

const ProposeTimeWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  p:first-child {
    min-width: 154px;
  }
  > :first-child {
    line-height: 22px;
    color: rgba(0, 0, 0, 0.9) !important;
  }
  > :last-child {
    * {
      font-size: 12px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.3);
    }
    img {
      width: 14px !important;
      height: 14px !important;
    }
  }
`;

const CapText = styled(Text)`
  text-transform: capitalize;
  white-space: nowrap;
`;

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const getStateWithVotingAyes = (item) => {
  const state = item.state?.state;
  const isVoting = ["ApproveVoting", "RejectVoting"].includes(state);

  if (isVoting) {
    const nAyes = item.state.data.motionVoting?.ayes?.length;
    if (nAyes !== undefined) {
      return state + ` (${nAyes})`;
    }
  }
  return state;
};

const BountiesTable = ({ data, loading, header, footer }) => {
  const symbol = useSelector(chainSymbolSelector);
  const history = useHistory();

  const getDetailRoute = (row) => {
    const type = row.parentBountyId >= 0 ? "child-bounties" : "bounties";
    return `/${symbol.toLowerCase()}/${type}/${row.bountyIndex}`;
  };
  const onRowClick = (row) => {
    if (window.innerWidth < 1140) {
      const detailRoute = getDetailRoute(row);
      history.push(detailRoute);
    }
  };

  const columns = [
    {
      key: "index",
      title: "Index",
      dataIndex: "bountyIndex",
      cellClassName: "index-cell",
      cellRender: (value) => <TextMinor>#{value}</TextMinor>,
    },
    {
      key: "propose-time",
      title: "Propose Time",
      cellClassName: "propose-time-cell",
      cellRender: (_, item) => (
        <ProposeTimeWrapper>
          <TextMinor>
            {dayjs(parseInt(item.proposeTime)).format("YYYY-MM-DD HH:mm:ss")}
          </TextMinor>
          <ExplorerLink href={`/block/${item.proposeAtBlockHeight}`}>
            <PolygonLabel fontSize={12} value={item.proposeAtBlockHeight} />
          </ExplorerLink>
        </ProposeTimeWrapper>
      ),
    },
    {
      key: "curator",
      title: "Curator",
      dataIndex: "curator",
      cellClassName: "user-cell",
      cellRender: (_, item) =>
        item.curator ? <User address={item.curator} /> : "--",
    },
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
      cellClassName: "title-cell",
    },
    {
      key: "value",
      title: "Value",
      headerCellProps: { textAlign: "right" },
      cellProps: { textAlign: "right" },
      cellClassName: "balance-cell",
      cellRender: (_, item) => (
        <Balance value={item.value} currency={symbol} usdt={item.symbolPrice} />
      ),
    },
    {
      key: "status",
      title: "Status",
      headerCellProps: { textAlign: "right" },
      cellProps: { textAlign: "right" },
      cellClassName: "status-cell",
      cellRender: (_, item) => (
        <CapText>{getStateWithVotingAyes(item)}</CapText>
      ),
    },
    {
      key: "navigate-button",
      title: "",
      cellClassName: "link-cell hidden",
      cellRender: (_, item) => {
        return (
          <NavLink to={getDetailRoute(item)}>
            <RightButton />
          </NavLink>
        );
      },
    },
  ];

  return (
    <CardWrapper>
      {header && <HeaderWrapper>{header}</HeaderWrapper>}
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            {(data && data.length > 0 && (
              <Table
                tree
                treeKey="childBounties"
                treeDataTransform={compatChildBountyData}
                columns={columns}
                data={data}
                onRowClick={onRowClick}
              />
            )) || <TableNoDataCell />}
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      {footer}
    </CardWrapper>
  );
};

export default BountiesTable;
