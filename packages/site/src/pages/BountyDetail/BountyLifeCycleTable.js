import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import TimeLabel from "../../components/TimeLabel";
import User from "../../components/User";
import { scanHeightSelector } from "../../store/reducers/chainSlice";
import Label from "../../components/Label";

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
  const scanHeight = useSelector(scanHeightSelector);

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
          { bountyDetail.curator &&
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Curator"}>
                  <User address={bountyDetail.curator} />
                </TableCell>
              </Table.Cell>
            </Table.Row>
          }
          { bountyDetail.updateDue &&
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Update Due"}>
                  <FlexWrapper>
                    <div>{bountyDetail.updateDue}</div>
                    <Label>{`${bountyDetail.updateDue - scanHeight} blocks`}</Label>
                  </FlexWrapper>
                </TableCell>
              </Table.Cell>
            </Table.Row>
          }
          { bountyDetail.beneficiary &&
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Beneficiary"}>
                  <User address={bountyDetail.beneficiary} />
                </TableCell>
              </Table.Cell>
            </Table.Row>
          }
          { bountyDetail.unlockAt &&
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Unlock At"}>
                  <FlexWrapper>
                    <div>{bountyDetail.unlockAt}</div>
                    <Label>{`${bountyDetail.unlockAt - scanHeight} blocks`}</Label>
                  </FlexWrapper>
                </TableCell>
              </Table.Cell>
            </Table.Row>
          }
        </Table.Body>
      </Table>
    </TableLoading>
  );
};

export default BountyLifeCycleTable;
