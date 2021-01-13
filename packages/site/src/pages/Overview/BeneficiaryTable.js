import React from "react";
import styled from "styled-components";

import Table from "../../components/Table";
import User from "../../components/User";
import Balance from "../../components/Balance";
import Text from "../../components/Text";

const Title = styled(Text)`
  font-size: 18px;
  line-height: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`

const BeneficiaryTable = () => {
  return (
    <div>
      <Title>Proposal Beneficiary</Title>
      <Table striped selectable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Beneficiary</Table.HeaderCell>
            <Table.HeaderCell textAlign={"right"}>Total value</Table.HeaderCell>
            <Table.HeaderCell textAlign={"right"}>Proposal count</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <User address="DeFR1kGwiAYp1mqCpozD5h6ARZrrMgMykBCcJVPaLFYgSmk" />
            </Table.Cell>
            <Table.Cell textAlign={"right"}>
              <Balance value="1000000000000" />
            </Table.Cell>
            <Table.Cell textAlign={"right"}>
              <Text>50</Text>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};

export default BeneficiaryTable;
