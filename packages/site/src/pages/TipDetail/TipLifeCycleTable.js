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
import {
  currentBlockHeightSelector,
} from "../../store/reducers/chainSlice";

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

const TipLefeCycleTabel = () => {
  const tipDetail = useSelector(normalizedTipDetailSelector);
  const tipFindersFee = useSelector(tipFindersFeeSelector);
  const tipCountdown = useSelector(tipCountdownSelector);
  const currentBlockHeight = useSelector(currentBlockHeightSelector);
  const tippersCount = tipDetail.tippersCount;
  const closeFromBlockHeight = tipDetail.closeFromBlockHeight;
  const progressBlockHeight = Math.min(closeFromBlockHeight, currentBlockHeight);
  const reminingCountdown = closeFromBlockHeight - progressBlockHeight;
  const precent = 1 - reminingCountdown / tipCountdown;

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
                <TimeLabel value={<TimeElapsed from={tipDetail.latestState?.time} />} />
              </FlexWrapper>
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title="Threshold">
              <FlexWrapper>
                <TippersProgress total={tippersCount} current={tipDetail.tipsCount} />
                <TippersLabel>{tipDetail.tipsCount}/{tippersCount}</TippersLabel>
              </FlexWrapper>
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title="Tip Count Down">
            { closeFromBlockHeight
                ? <FlexWrapper>
                    <Progress percent={precent * 100} />
                    <TipCountDownLabel value={tipCountdown - reminingCountdown} total={tipCountdown} />
                  </FlexWrapper>
                : <FlexWrapper>
                    <Progress percent={0} />
                    <TipCountDownLabel value={0} total={tipCountdown} />
                  </FlexWrapper>
            }
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title="Finders Fee">
              <div>{tipFindersFee.toFixed(2)}%</div>
            </TableCell>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default TipLefeCycleTabel;
