import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableCell from "../../components/TableCell";
import User from "../../components/User/Index";
import Balance from "../../components/Balance";
import DateShow from "../../components/DateShow";
import PolygonLabel from "./PolygonLabel";
import ExplorerLink from "../../components/ExplorerLink";

import {
  proposalDetailSelector,
} from "../../store/reducers/proposalSlice";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const InformationTable = () => {
  const proposalDetail = useSelector(proposalDetailSelector);

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
                <div><DateShow value={proposalDetail.proposeTime}/></div>
                <ExplorerLink href={`/block/${proposalDetail.proposeAtBlockHeight}`}>
                  <PolygonLabel value={proposalDetail.proposeAtBlockHeight} />
                </ExplorerLink>
              </FlexWrapper>
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title={"Proposer"}>
              <User address={proposalDetail.proposer} />
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title={"Beneficiary"}>
              <User address={proposalDetail.beneficiary} />
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title={"Value"}>
              <Balance value={proposalDetail.value} />
            </TableCell>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default InformationTable;
