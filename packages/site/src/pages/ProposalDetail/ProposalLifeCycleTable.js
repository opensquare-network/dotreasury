import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableCell from "../../components/TableCell";
import TimeLabel from "./TimeLabel";
import TimeElapsed from "../../components/TimeElapsed";

import {
  proposalDetailSelector,
} from "../../store/reducers/proposalSlice";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ProposalLifeCycleTable = () => {
  const proposalDetail = useSelector(proposalDetailSelector);

  return (
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
                <TimeLabel
                  value={<TimeElapsed from={proposalDetail.latestState?.time} />}
                />
              </FlexWrapper>
            </TableCell>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default ProposalLifeCycleTable;
