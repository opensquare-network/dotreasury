import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import User from "../../components/User";
import Text from "../../components/Text";
import {
  chainSelector,
  scanHeightSelector,
} from "../../store/reducers/chainSlice";
import Label from "../../components/Label";
import DateShow from "../../components/DateShow";
import PolygonLabel from "../../components/PolygonLabel";
import ExplorerLink from "../../components/ExplorerLink";
import { useIsMounted } from "../../utils/hooks";
import { estimateBlocksTime } from "../../services/chainApi";

import { bountyDetailSelector } from "../../store/reducers/bountySlice";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const CapText = styled(Text)`
  text-transform: capitalize;
`;

const BountyLifeCycleTable = ({ loading }) => {
  const bountyDetail = useSelector(bountyDetailSelector);
  const scanHeight = useSelector(scanHeightSelector);
  const [updateDueTimeLeft, setUpdateDueTimeLeft] = useState("");
  const isMounted = useIsMounted();
  const chain = useSelector(chainSelector);

  useEffect(() => {
    if (bountyDetail.updateDue) {
      estimateBlocksTime(chain, bountyDetail.updateDue - scanHeight).then(
        (blocksTime) => {
          let timeLeft = "";
          const oneMinute = 60 * 1000;
          const oneHour = 60 * oneMinute;
          const oneDay = 24 * oneHour;
          if (blocksTime > oneDay) {
            timeLeft = `${parseInt(blocksTime / oneDay)} days`;
          } else if (blocksTime > oneHour) {
            timeLeft = `${parseInt(blocksTime / oneHour)} hours`;
          } else if (blocksTime > oneMinute) {
            timeLeft = `${parseInt(blocksTime / oneMinute)} minutes`;
          } else {
            timeLeft = "less then 1 minute";
          }
          if (isMounted.current) {
            setUpdateDueTimeLeft(timeLeft);
          }
        }
      );
    }
  }, [chain, bountyDetail, scanHeight, isMounted]);

  return (
    <TableLoading loading={loading}>
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Bounty Life Cycle</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Created"}>
                <FlexWrapper>
                  <div>
                    <DateShow value={bountyDetail.proposeTime} />
                  </div>
                  <ExplorerLink
                    href={`/block/${bountyDetail.proposeAtBlockHeight}`}
                  >
                    <PolygonLabel value={bountyDetail.proposeAtBlockHeight} />
                  </ExplorerLink>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Status">
                <FlexWrapper>
                  <CapText>{bountyDetail.state?.state}</CapText>
                  {/* <ElapsedTimeLabel time={bountyDetail.latestState?.indexer?.blockTime} /> */}
                  <div />
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Curator"}>
                {bountyDetail.curator ? (
                  <User address={bountyDetail.curator} />
                ) : (
                  "--"
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Update Due"}>
                {bountyDetail.updateDue ? (
                  <FlexWrapper>
                    <div>
                      {updateDueTimeLeft ? `${updateDueTimeLeft} left` : "--"}
                    </div>
                    <PolygonLabel
                      value={bountyDetail.updateDue}
                      noHover={true}
                    />
                  </FlexWrapper>
                ) : (
                  "--"
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Beneficiary"}>
                {bountyDetail.beneficiary ? (
                  <User address={bountyDetail.beneficiary} />
                ) : (
                  "--"
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell
                title={`${
                  scanHeight < bountyDetail.unlockAt ? "Unlock" : "Unlocked"
                } At`}
              >
                {bountyDetail.unlockAt ? (
                  <FlexWrapper>
                    {scanHeight < bountyDetail.unlockAt ? (
                      <>
                        <div>{bountyDetail.unlockAt}</div>
                        <Label>{`${
                          bountyDetail.unlockAt - scanHeight
                        } blocks`}</Label>
                      </>
                    ) : (
                      <ExplorerLink href={`/block/${bountyDetail.unlockAt}`}>
                        <PolygonLabel value={bountyDetail.unlockAt} />
                      </ExplorerLink>
                    )}
                  </FlexWrapper>
                ) : (
                  "--"
                )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </TableLoading>
  );
};

export default BountyLifeCycleTable;
