import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableCell from "../../components/TableCell";
import User from "../../components/User";
import Balance from "../../components/Balance";
import DateShow from "../../components/DateShow";
import PolygonLabel from "../../components/PolygonLabel";
import { TipStatus } from "../../constants";
import ExplorerLink from "../../components/ExplorerLink";
import TableLoading from "../../components/TableLoading";
import ClickableLink from "../../components/ClickableLink";

import {
  normalizedTipDetailSelector,
} from "../../store/reducers/tipSlice";
import {
  linksSelector,
} from "../../store/reducers/linkSlice";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const InformationTable = ({ loading }) => {
  const tipDetail = useSelector(normalizedTipDetailSelector);
  const links = useSelector(linksSelector);

  return (
    <TableLoading loading={loading} >
      <Table striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Information</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Created"}>
                <FlexWrapper>
                  <div><DateShow value={tipDetail.proposeTime}/></div>
                  <ExplorerLink href={`/block/${tipDetail.proposeAtBlockHeight}`}>
                    <PolygonLabel value={tipDetail.proposeAtBlockHeight} />
                  </ExplorerLink>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Finder"}>
                <User address={tipDetail.finder} />
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Beneficiary"}>
                <User address={tipDetail.beneficiary} />
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Value"}>
                {
                  tipDetail.showStatus === TipStatus.Retracted
                    ? "--"
                    : <Balance value={tipDetail.medianValue} />
                }
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Reason"}>
                <ClickableLink links={links}>{tipDetail.reason}</ClickableLink>
              </TableCell>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </TableLoading>
  );
};

export default InformationTable;
