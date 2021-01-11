import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import TimeLabel from "../../components/TimeLabel";
import User from "../../components/User";

import {
  bountyDetailSelector,
} from "../../store/reducers/bountySlice";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const BountyLifeCycleTable = ({loading}) => {
  const bountyDetail = useSelector(bountyDetailSelector);

  return (
    <TableLoading loading={loading}>
      <Table striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Bounty Life Cycle</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Status">
                <FlexWrapper>
                  <div>{bountyDetail.latestState?.state}</div>
                  <TimeLabel value={bountyDetail.latestState?.indexer?.blockTime} />
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Curator"}>
                { bountyDetail.curator ? <User address={bountyDetail.curator} /> : "--" }
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Beneficiary"}>
                { bountyDetail.beneficiary ? <User address={bountyDetail.beneficiary} /> : "--" }
              </TableCell>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </TableLoading>
  );
};

export default BountyLifeCycleTable;
