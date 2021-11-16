import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import User from "../../components/User";
import Balance from "../../components/Balance";

import { bountyDetailSelector } from "../../store/reducers/bountySlice";
import { capitalizeFirstLetter } from "../../utils";

const ReturnedText = styled.div`
  color: rgba(0, 0, 0, 0.3);
  font-size: 14px;
  line-height: 22px;
  margin-left: 16px;
`;

const ReturnedWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AlignItemWrapper = styled.div`
  * {
    align-items: flex-start;
  }
`;

const BountyStates = Object.freeze({
  Proposed: 0,
  Rejected: 1,
  Approved: 2,
  Funded: 3,
  CuratorProposed: 4,
  Active: 5,
  PendingPayout: 6,
  Claimed: 7,
});

function getBountyState(bountyDetail) {
  return (
    BountyStates[capitalizeFirstLetter(bountyDetail.state?.state)] ?? -1
  );
}

const InformationTable = ({ loading }) => {
  const bountyDetail = useSelector(bountyDetailSelector);
  return (
    <TableLoading loading={loading}>
      <Table unstackable>
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
                <Balance
                  value={bountyDetail.value}
                  usdt={bountyDetail.symbolPrice}
                  horizontal
                />
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Bond"}>
                <ReturnedWrapper>
                  <Balance value={bountyDetail.bond} />
                  {getBountyState(bountyDetail) > BountyStates.Rejected ? (
                    <ReturnedText>Returned to proposer</ReturnedText>
                  ) : null}
                </ReturnedWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Fee"}>
                {getBountyState(bountyDetail) < BountyStates.CuratorProposed ? (
                  "--"
                ) : (
                  <AlignItemWrapper>
                    <Balance value={bountyDetail.fee} />
                  </AlignItemWrapper>
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Curator Deposit"}>
                <ReturnedWrapper>
                  {getBountyState(bountyDetail) < BountyStates.Active ? (
                    "--"
                  ) : (
                    <AlignItemWrapper>
                      <Balance value={bountyDetail.curatorDeposit} />
                    </AlignItemWrapper>
                  )}
                  {getBountyState(bountyDetail) >=
                  BountyStates.PendingPayout ? (
                    <ReturnedText>Returned to curator</ReturnedText>
                  ) : null}
                </ReturnedWrapper>
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
