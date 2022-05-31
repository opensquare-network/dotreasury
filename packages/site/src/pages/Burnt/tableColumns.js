import styled from "styled-components";
import ExplorerLink from "../../components/ExplorerLink";
import Text from "../../components/Text";
import PolygonLabel from "../../components/PolygonLabel";
import dayjs from "dayjs";
import { Image } from "semantic-ui-react";
import Balance from "../../components/Balance";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  p:first-child {
    min-width: 154px;
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

export function useColumns() {
  const symbol = useSelector(chainSymbolSelector);
  const columns = [
    {
      key: "time",
      title: "Time",
      cellClassName: "propose-time-cell",
      cellRender: (_, item) => (
        <TimeWrapper>
          <Text>
            {dayjs(parseInt(item.indexer.blockTime)).format(
              "YYYY-MM-DD HH:mm:ss"
            )}
          </Text>
          <ExplorerLink href={`/block/${item.indexer.blockHeight}`}>
            <PolygonLabel value={item.indexer.blockHeight} />
          </ExplorerLink>
        </TimeWrapper>
      ),
    },
    {
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
    },
    {
      key: "value",
      title: "Value",
      headerCellProps: { textAlign: "right" },
      cellProps: { textAlign: "right" },
      cellClassName: "balance-cell",
      cellRender: (_, item) => (
        <Balance value={item.balance} currency={symbol} />
      ),
    },
    {
      key: "per",
      title: "Per",
      headerCellProps: { textAlign: "right" },
      cellProps: { textAlign: "right" },
      dataIndex: "burnPercent",
      cellClassName: "balance-cell",
    },
    {
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
    },
  ];

  return {
    columns,
  };
}
