import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import Balance from "../../components/Balance";
import TextMinor from "../../components/TextMinor";
import ExplorerLink from "../../components/ExplorerLink";
import TableNoDataCell from "../../components/TableNoDataCell";

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

const BurntTable = ({ data, loading }) => {
  return (
    <Wrapper>
      <TableLoading loading={loading}>
        <StyledTable striped selectable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Index</Table.HeaderCell>
              <Table.HeaderCell>Burnt Time</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Burnt Balance</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Burnt Precentage</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Treasury Balance</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(data &&
              data.length > 0 &&
              data.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <ExplorerLink href={`/extrinsic/${item.indexer.blockHeight}-0?event=${item.indexer.blockHeight}-${item.indexer.sort}`}>
                      {`${item.indexer.blockHeight}-${item.indexer.sort}`}
                    </ExplorerLink>
                  </Table.Cell>
                  <Table.Cell>
                    <TextMinor>{dayjs(parseInt(item.indexer.blockTime)).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}</TextMinor>
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <Balance value={item.balance} />
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    {item.burnPrecent}
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <Balance value={item.treasury.free} />
                  </Table.Cell>
                </Table.Row>
              ))) || (
                <TableNoDataCell />
            )}
          </Table.Body>
        </StyledTable>
      </TableLoading>
    </Wrapper>
  );
};

export default BurntTable;
