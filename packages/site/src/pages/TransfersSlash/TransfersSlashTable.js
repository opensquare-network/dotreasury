import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { Image } from "semantic-ui-react";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import Balance from "../../components/Balance";
import Text from "../../components/Text";
import ExplorerLink from "../../components/ExplorerLink";
import TableNoDataCell from "../../components/TableNoDataCell";
import PolygonLabel from "../../components/PolygonLabel";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import Card from "../../components/Card";
import User from "../../components/User";

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

const StyledTable = styled(Table)`
  .short-padding {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
  }
  .no-data {
    height: 120px !important;
  }
`;

const TableRow = styled(Table.Row)`
  height: 50px;
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  p:first-child {
    min-width: 154px;
  }
`;

const EventID = styled(Text)`
  white-space: nowrap;
  &:hover {
    text-decoration-line: underline;
  }
`;

const EventWrapper = styled.div`
  display: flex;
  align-items: center;
  & > img {
    margin-right: 4px;
  }
`;

const TransfersTable = ({ data, loading, header, footer }) => {
  const symbol = useSelector(chainSymbolSelector);

  return (
    <CardWrapper>
      {header}
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <StyledTable unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Time</Table.HeaderCell>
                  <Table.HeaderCell>Event ID</Table.HeaderCell>
                  <Table.HeaderCell>Sender</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>
                    Balance
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(data &&
                  data.length > 0 &&
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <Table.Cell className="propose-time-cell">
                        <TimeWrapper>
                          <Text>
                            {dayjs(parseInt(item.indexer.blockTime)).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </Text>
                          <ExplorerLink
                            href={`/block/${item.indexer.blockHeight}`}
                          >
                            <PolygonLabel value={item.indexer.blockHeight} />
                          </ExplorerLink>
                        </TimeWrapper>
                      </Table.Cell>
                      <Table.Cell>
                        <ExplorerLink
                          href={`/extrinsic/${item.indexer.blockHeight}-0?event=${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
                        >
                          <EventWrapper>
                            <Image src={"/imgs/event.svg"} />
                            <EventID>{`${item.indexer.blockHeight}-${item.indexer.eventIndex}`}</EventID>
                          </EventWrapper>
                        </ExplorerLink>
                      </Table.Cell>
                      <Table.Cell>
                        <User
                          address={item.from}
                          ellipsis={false}
                        />
                      </Table.Cell>
                      <Table.Cell textAlign={"right"} className="balance-cell">
                        <Balance value={item.balance} currency={symbol} />
                      </Table.Cell>
                    </TableRow>
                  ))) || <TableNoDataCell />}
              </Table.Body>
            </StyledTable>
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      {footer}
    </CardWrapper>
  );
};

export default TransfersTable;
