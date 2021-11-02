import React from "react";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableCell from "../../components/TableCell";
import User from "../../components/User";
import Balance from "../../components/Balance";
import { TipStatus } from "../../constants";
import TableLoading from "../../components/TableLoading";
import ClickableLink from "../../components/ClickableLink";

import {
  normalizedTipDetailSelector,
  tipFindersFeeSelector,
} from "../../store/reducers/tipSlice";
import { linksSelector } from "../../store/reducers/linkSlice";

const InformationTable = ({ loading }) => {
  const tipDetail = useSelector(normalizedTipDetailSelector);
  const links = useSelector(linksSelector);
  const tipFindersFee = useSelector(tipFindersFeeSelector);
  const findersFee =
    tipDetail?.timeline?.[0]?.method === "tipNew" ||
    tipDetail?.timeline?.[0]?.extrinsic?.name === "tipNew"
      ? 0
      : `${(tipFindersFee ?? 0).toFixed(2)}%`;

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
                {tipDetail.showStatus === TipStatus.Retracted ? (
                  "--"
                ) : (
                  <Balance
                    value={tipDetail.medianValue}
                    usdt={tipDetail.symbolPrice}
                    horizontal
                  />
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
