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
} from "../../store/reducers/tipSlice";

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
  const tippersCount = 13;

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
            <TableCell title="Tippers">
              <FlexWrapper>
                <TippersProgress total={tippersCount} current={tipDetail.tips?.length} />
                <TippersLabel>{tipDetail.tips?.length}/{tippersCount}</TippersLabel>
              </FlexWrapper>
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title="Tip Count Down">
              <FlexWrapper>
                <Progress percent={50} />
                <TipCountDownLabel value={14400} />
              </FlexWrapper>
            </TableCell>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <TableCell title="Finders Fee">
              <div>20.00%</div>
            </TableCell>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default TipLefeCycleTabel;
