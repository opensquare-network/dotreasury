import React from "react";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import User from "../../components/User";
import Balance from "../../components/Balance";

import {
  proposalDetailSelector,
} from "../../store/reducers/proposalSlice";

const InformationTable = ({ loading }) => {
  const proposalDetail = useSelector(proposalDetailSelector);
  return (
    <TableLoading loading={loading}>
      <Table striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Information</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Index"}>
                {`#${proposalDetail.proposalIndex}`}
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
    </TableLoading>
  );
};

export default InformationTable;
