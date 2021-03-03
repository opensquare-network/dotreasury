import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import Progress from "../../components/Progress";
import TipCountDownLabel from "./TipCountDownLabel";
import BarProgress from "../../components/BarProgress";
import ElapsedTimeLabel from "../../components/ElapsedTimeLabel";
import DateShow from "../../components/DateShow";
import PolygonLabel from "../../components/PolygonLabel";
import ExplorerLink from "../../components/ExplorerLink";

import {
  normalizedTipDetailSelector,
  tipCountdownSelector,
} from "../../store/reducers/tipSlice";
import { scanHeightSelector } from "../../store/reducers/chainSlice";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  :first-child {
    margin-right: 16px;
  }
`;

const TippersLabel = styled.div`
  min-width: 100px;
  text-align: right;
  color: rgba(29, 37, 60, 0.64);
`;

const TipLifeCycleTable = ({ loading }) => {
  const tipDetail = useSelector(normalizedTipDetailSelector);
  const tipCountdown = useSelector(tipCountdownSelector);
  const scanHeight = useSelector(scanHeightSelector);
  const tippersCount = tipDetail.tippersCount;

  const begin = tipDetail.closeFromBlockHeight - tipCountdown;
  const goneBlocks = Math.max(scanHeight - begin, 0);
  const percentage = goneBlocks > tipCountdown ? 1 : goneBlocks / tipCountdown;

  const thresholdTotalCount = tippersCount ? (tippersCount + 1) / 2 : 0;

  return (
    <TableLoading loading={loading}>
      <Table striped selectable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Tip Life Cycle</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Created"}>
                <FlexWrapper>
                  <div><DateShow value={tipDetail.proposeTime} /></div>
                  <ExplorerLink href={`/block/${tipDetail.proposeAtBlockHeight}`}>
                    <PolygonLabel value={tipDetail.proposeAtBlockHeight} />
                  </ExplorerLink>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Status">
                <FlexWrapper>
                  <div>{tipDetail.showStatus}</div>
                  <ElapsedTimeLabel time={tipDetail.latestState?.time} />
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Threshold">
                <FlexWrapper>
                  <BarProgress
                    total={thresholdTotalCount}
                    current={tipDetail.tipsCount}
                  />
                  <TippersLabel>
                    {tipDetail.tipsCount}/{thresholdTotalCount}
                  </TippersLabel>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Closes">
                {tipDetail.closeFromBlockHeight ? (
                  <FlexWrapper>
                    <Progress percent={percentage * 100} />
                    <TipCountDownLabel
                      scanHeight={scanHeight}
                      closes={tipDetail.closeFromBlockHeight}
                    />
                  </FlexWrapper>
                ) : (
                    <FlexWrapper>
                      <Progress percent={0} />
                      <TipCountDownLabel
                        scanHeight={scanHeight}
                        closes={tipDetail.closeFromBlockHeight}
                      />
                    </FlexWrapper>
                  )}
              </TableCell>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </TableLoading>
  );
};

export default TipLifeCycleTable;
