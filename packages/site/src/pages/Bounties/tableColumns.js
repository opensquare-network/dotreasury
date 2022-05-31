import styled from "styled-components";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";
import ExplorerLink from "../../components/ExplorerLink";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import PolygonLabel from "../../components/PolygonLabel";
import User from "../../components/User";
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";

const CapText = styled(Text)`
  text-transform: capitalize;
  white-space: nowrap;
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

export const getStateWithVotingAyes = (item) => {
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

// table columns
export function useColumns(symbol = "") {
  const getDetailRoute = (row) => {
    const type = row.parentBountyId >= 0 ? "child-bounties" : "bounties";
    return `/${symbol.toLowerCase()}/${type}/${row.bountyIndex}`;
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

  return {
    columns,
    getDetailRoute,
  };
}
