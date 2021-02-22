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

const Wrapper = styled.div`
  overflow-x: scroll;

  @media screen and (max-width: 1140px) {
    position: relative;
    left: -16px;
    padding: 0 16px;
    width: calc(100% + 32px);
    .hidden {
      display: none;
    }
  }
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

const SlashTable = ({ data, loading }) => {
  return (
    <Wrapper>
      <TableLoading loading={loading}>
        <StyledTable striped selectable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell>Event ID</Table.HeaderCell>
              <Table.HeaderCell>Event Name</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Balance</Table.HeaderCell>
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
                      <ExplorerLink href={`/block/${item.indexer.blockHeight}`}>
                        <PolygonLabel value={item.indexer.blockHeight} />
                      </ExplorerLink>
                    </TimeWrapper>
                  </Table.Cell>
                  <Table.Cell>
                    <ExplorerLink
                      href={`/block/${item.indexer.blockHeight}?tab=event`}
                    >
                      <EventWrapper>
                        <Image src={"/imgs/event.svg"} />
                        <EventID>{`${item.indexer.blockHeight}-${item.eventSort}`}</EventID>
                      </EventWrapper>
                    </ExplorerLink>
                  </Table.Cell>
                  <Table.Cell>{`${item.section}(${item.method})`}</Table.Cell>
                  <Table.Cell textAlign={"right"} className="balance-cell">
                    <Balance value={item.balance} />
                  </Table.Cell>
                </TableRow>
              ))) || <TableNoDataCell />}
          </Table.Body>
        </StyledTable>
      </TableLoading>
    </Wrapper>
  );
};

export default SlashTable;
