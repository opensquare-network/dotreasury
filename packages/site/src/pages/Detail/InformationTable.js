import React from "react";
import styled from "styled-components";

import Table from "../../components/Table";
import TableCell from "../../components/TableCell";
import User from "../../components/User";
import Balance from "../../components/Balance";
import PolygonLabel from "./PolygonLabel";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const InformationTable = () => {
  return (
    <Table striped selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Information</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <TableCell title={"Created"}>
              <FlexWrapper>
                <div>2020-12-12 09:43:41</div>
                <PolygonLabel value={"5047572"} />
              </FlexWrapper>
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title={"Finder"}>
              <User name={"HUfzjs5WNDNJfbP5kPUBpneAizE5yCprsX"} />
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title={"Beneficiary"}>
              <User name={"Eleanor"} />
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title={"Value"}>
              <Balance value={"50.00"} />
            </TableCell>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default InformationTable;
