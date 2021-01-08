import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import TimeLabel from "../../components/TimeLabel";

import {
  proposalDetailSelector,
} from "../../store/reducers/proposalSlice";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ProposalLifeCycleTable = ({loading}) => {
  const proposalDetail = useSelector(proposalDetailSelector);

  return (
    <TableLoading loading={loading}>
      <Table striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Proposal Life Cycle</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Status">
                <FlexWrapper>
                  <div>{proposalDetail.latestState?.state}</div>
                  <TimeLabel value={proposalDetail.latestState?.time} />
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </TableLoading>
  );
};

export default ProposalLifeCycleTable;
