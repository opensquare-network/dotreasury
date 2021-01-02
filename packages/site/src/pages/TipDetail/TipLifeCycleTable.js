import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableCell from "../../components/TableCell";
import TimeLabel from "./TimeLabel";
import Progress from "./Progress";
import TipCountDownLabel from "./TipCountDownLabel";
import TippersProgress from "./TippersProgress";
import TimeElapsed from "../../components/TimeElapsed";

import {
  normalizedTipDetailSelector,
  tipCountdownSelector,
  tipFindersFeeSelector,
} from "../../store/reducers/tipSlice";
import { scanHeightSelector } from "../../store/reducers/chainSlice";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const TippersLabel = styled.div`
  min-width: 100px;
  text-align: right;
  color: rgba(29, 37, 60, 0.64);
`;

const TipLifeCycleTable = () => {
  const tipDetail = useSelector(normalizedTipDetailSelector);
  const tipFindersFee = useSelector(tipFindersFeeSelector);
  const tipCountdown = useSelector(tipCountdownSelector);
  const scanHeight = useSelector(scanHeightSelector);
  const tippersCount = tipDetail.tippersCount;

  const begin = tipDetail.closeFromBlockHeight - tipCountdown;
  const goneBlocks = Math.max(scanHeight - begin, 0);
  const percentage = goneBlocks > tipCountdown ? 1 : goneBlocks / tipCountdown;

  const thresholdTotalCount = tippersCount ? (tippersCount + 1) / 2 : 0;
  const findersFee =
    tipDetail?.timeline?.[0]?.extrinsic?.name === "tipNew"
      ? 0
      : `${tipFindersFee.toFixed(2)}%`;

  return (
    <Table striped selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Tip Life Cycle</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <TableCell title="Status">
              <FlexWrapper>
                <div>{tipDetail.showStatus}</div>
                <TimeLabel
                  value={<TimeElapsed from={tipDetail.latestState?.time} />}
                />
              </FlexWrapper>
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title="Threshold">
              <FlexWrapper>
                <TippersProgress
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
            <TableCell title="Tip Count Down">
              {tipDetail.closeFromBlockHeight ? (
                <FlexWrapper>
                  <Progress percent={percentage * 100} />
                  <TipCountDownLabel value={goneBlocks} total={tipCountdown} />
                </FlexWrapper>
              ) : (
                <FlexWrapper>
                  <Progress percent={0} />
                  <TipCountDownLabel value={0} total={tipCountdown} />
                </FlexWrapper>
              )}
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title="Finders Fee">
              <div>{findersFee}</div>
            </TableCell>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default TipLifeCycleTable;
