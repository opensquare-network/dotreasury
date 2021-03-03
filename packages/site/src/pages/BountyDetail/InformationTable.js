import React from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import User from "../../components/User";
import Balance from "../../components/Balance";
import Label from "../../components/Label";
import { mrgap } from "../../styles";

import { bountyDetailSelector } from "../../store/reducers/bountySlice";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${css`
    ${mrgap("16px")}
  `}
`;

const BountyStates = Object.freeze({
  Proposed: 0,
  Rejected: 1,
  Approved: 2,
  Funded: 3,
  CuratorProposed: 4,
  Active: 5,
  PendingPayout: 6,
});

function getBountyState(bountyDetail) {
  return BountyStates[bountyDetail.latestState?.state] ?? -1;
}

const InformationTable = ({ loading }) => {
  const bountyDetail = useSelector(bountyDetailSelector);
  return (
    <TableLoading loading={loading}>
      <Table striped selectable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Information</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Index"}>
                {`#${bountyDetail.bountyIndex}`}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Proposer"}>
                <User address={bountyDetail.proposer} />
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Value"}>
                <Balance value={bountyDetail.value} />
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Bond"}>
                <FlexWrapper>
                  <Balance value={bountyDetail.bond} />
                  <Label>
                    {getBountyState(bountyDetail) > BountyStates.Proposed
                      ? "has returned to the proposer"
                      : ""}
                  </Label>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Fee"}>
                {getBountyState(bountyDetail) <
                BountyStates.CuratorProposed ? (
                  "--"
                ) : (
                  <Balance value={bountyDetail.fee} />
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Curator Deposit"}>
                {getBountyState(bountyDetail) <
                BountyStates.Active ? (
                  "--"
                ) : (
                  <Balance value={bountyDetail.curatorDeposit} />
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Title"}>{bountyDetail.title}</TableCell>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </TableLoading>
  );
};

export default InformationTable;
