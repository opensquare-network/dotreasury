import styled from "styled-components";
import Card from "../../components/Card";
import Table from "../../components/Table";
import TableNoDataCell from "../../components/TableNoDataCell";
import User from "../../components/User";
import Balance from "../../components/Balance";
import Text from "../../components/Text";
import TableLoading from "../../components/TableLoading";

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

const TableRow = styled(Table.Row)`
  height: 50px;
`;

const TableCell = styled(Table.Cell)`
  width: 160px;
`;

export default function TipFindersTable({ data, loading, header, footer }) {
  return (
    <CardWrapper>
      {header}

      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <Table unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Finder</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>Count</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>
                    Total value
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data && data.length > 0 ? (
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <Table.Cell>
                        <User address={item.finder} />
                      </Table.Cell>
                      <TableCell textAlign={"right"}>
                        <Text>{item.count}</Text>
                      </TableCell>
                      <TableCell textAlign={"right"}>
                        <Balance
                          value={item.value}
                          usdt={item.fiatValue}
                          isUnitPrice={false}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableNoDataCell />
                )}
              </Table.Body>
            </Table>
          </TableLoading>
        </TableWrapper>
      </Wrapper>

      {footer}
    </CardWrapper>
  );
}
