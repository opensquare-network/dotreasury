import styled from "styled-components";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { Image } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import ExplorerLink from "../ExplorerLink";
import Text from "../Text";
import TextMinor from "../TextMinor";
import PolygonLabel from "../PolygonLabel";
import User from "../User";
import Balance from "../Balance";
import RightButton from "../RightButton";

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

const EventWrapper = styled.div`
  display: flex;
  align-items: center;
  & > img {
    margin-right: 4px;
  }
`;

const EventID = styled(Text)`
  white-space: nowrap;
  &:hover {
    text-decoration-line: underline;
  }
`;

const CapText = styled(Text)`
  text-transform: capitalize;
  white-space: nowrap;
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

const proposeTime = {
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
};
const time = {
  key: "time",
  title: "Time",
  cellClassName: "propose-time-cell",
  cellRender: (_, item) => (
    <ProposeTimeWrapper>
      <Text>
        {dayjs(parseInt(item.indexer.blockTime)).format("YYYY-MM-DD HH:mm:ss")}
      </Text>
      <ExplorerLink href={`/block/${item.indexer.blockHeight}`}>
        <PolygonLabel fontSize={12} value={item.indexer.blockHeight} />
      </ExplorerLink>
    </ProposeTimeWrapper>
  ),
};
const eventId = {
  key: "event-id",
  title: "Event ID",
  cellRender: (_, item) => (
    <ExplorerLink
      href={`/extrinsic/${item.indexer.blockHeight}-0?event=${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
    >
      <EventWrapper>
        <Image src={"/imgs/event.svg"} />
        <EventID>{`${item.indexer.blockHeight}-${item.indexer.eventIndex}`}</EventID>
      </EventWrapper>
    </ExplorerLink>
  ),
};
const value = (symbol) => ({
  key: "value",
  title: "Value",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  cellClassName: "balance-cell",
  cellRender: (_, item) => <Balance value={item.balance} currency={symbol} />,
});
const per = {
  key: "per",
  title: "Per",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  dataIndex: "burnPercent",
  cellClassName: "balance-cell",
};
const remnant = (symbol) => ({
  key: "remnant",
  title: "Remnant",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  dataIndex: "burnPercent",
  cellClassName: "balance-cell",
  cellRender: (_, item) =>
    parseInt(item.treasuryBalance) <= 0 ? (
      "--"
    ) : (
      <Balance value={item.treasuryBalance} currency={symbol} />
    ),
});
const index = {
  key: "index",
  title: "Index",
  dataIndex: "bountyIndex",
  cellClassName: "index-cell",
  cellRender: (value) => <TextMinor>#{value}</TextMinor>,
};
const curator = {
  key: "curator",
  title: "Curator",
  dataIndex: "curator",
  cellClassName: "user-cell",
  cellRender: (_, item) =>
    item.curator ? <User address={item.curator} /> : "--",
};
const title = {
  key: "title",
  title: "Title",
  dataIndex: "title",
  cellClassName: "title-cell",
};
const status = {
  key: "status",
  title: "Status",
  headerCellProps: { textAlign: "right" },
  cellProps: { textAlign: "right" },
  cellClassName: "status-cell",
  cellRender: (_, item) => <CapText>{getStateWithVotingAyes(item)}</CapText>,
};
const detailRoute = (options) => ({
  key: "detailRoute",
  title: "",
  headerCellClassName: "hidden",
  cellClassName: "link-cell hidden",
  cellRender: (_, item) => {
    return (
      <NavLink to={options?.getDetailRoute?.(item)}>
        <RightButton />
      </NavLink>
    );
  },
});

export function useTableColumns(options) {
  const symbol = useSelector(chainSymbolSelector);

  return {
    proposeTime,
    time,
    eventId,
    value: value(symbol),
    per,
    remnant: remnant(symbol),
    index,
    curator,
    title,
    status,
    detailRoute: detailRoute(options),
  };
}
