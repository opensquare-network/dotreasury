import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Table from "../../components/Table";
import User from "../../components/User";
import Balance from "../../components/Balance";
import Text from "../../components/Text";
import TableNoDataCell from "../../components/TableNoDataCell";
import { overviewSelector } from "../../store/reducers/overviewSlice";

const Wrapper = styled.div`
  overflow: hidden;
`

const TableWrapper = styled.div`
  overflow: scroll;
`

const Title = styled(Text)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const TableRow = styled(Table.Row)`
  height: 50px;
`;

const ProposerTable = () => {
  const overview = useSelector(overviewSelector);
  const data = overview.bestTipFinders || [];

  return (
    <Wrapper>
      <Title>Top Tip Finders</Title>
        <TableWrapper>
        <Table striped selectable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Finder</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Count</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Total value</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index}>
                  <Table.Cell>
                    <User address={item.finder} />
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <Text>{item.count}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <Balance value={item.value} />
                  </Table.Cell>
                </TableRow>
              ))
            ) : (
              <TableNoDataCell />
            )}
          </Table.Body>
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

export default ProposerTable;
