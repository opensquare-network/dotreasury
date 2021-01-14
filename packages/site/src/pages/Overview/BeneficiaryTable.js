import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Table from "../../components/Table";
import User from "../../components/User";
import Balance from "../../components/Balance";
import Text from "../../components/Text";
import TableNoDataCell from "../../components/TableNoDataCell";
import { overviewSelector } from "../../store/reducers/overviewSlice";

const Title = styled(Text)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`

const BeneficiaryTable = () => {
  const overview = useSelector(overviewSelector);
  const data = overview.bestProposalBeneficiaries || [];

  return (
    <div>
      <Title>Top Proposal Beneficiaries</Title>
      <Table striped selectable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Beneficiary</Table.HeaderCell>
            <Table.HeaderCell textAlign={"right"}>Total value</Table.HeaderCell>
            <Table.HeaderCell textAlign={"right"}>Proposal count</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            data &&
            data.length > 0 &&
            (data.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <User address={item.beneficiary} />
                </Table.Cell>
                <Table.Cell textAlign={"right"}>
                  <Balance value={item.value} />
                </Table.Cell>
                <Table.Cell textAlign={"right"}>
                  <Text>{item.count}</Text>
                </Table.Cell>
              </Table.Row>
            )) || <TableNoDataCell />)
          }
        </Table.Body>
      </Table>
    </div>
  );
};

export default BeneficiaryTable;
