import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Table from "../../components/Table";
import User from "../../components/User";
import Balance from "../../components/Balance";
import Text from "../../components/Text";
import Card from "../../components/Card";
import TableNoDataCell from "../../components/TableNoDataCell";
import { overviewSelector } from "../../store/reducers/overviewSlice";

const CardWrapper = styled(Card)`
  overflow-x: hidden;
  padding: 0;
  table {
    border-radius: 0 !important;
    border: none !important;
  }
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const TableWrapper = styled.div`
  overflow: scroll;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  padding: 20px 24px;
`;

const TableRow = styled(Table.Row)`
  height: 50px;
`;

const BeneficiaryTable = () => {
  const overview = useSelector(overviewSelector);
  const data = overview.bestProposalBeneficiaries || [];

  return (
    <CardWrapper>
      <Title>Top Proposal Beneficiaries</Title>
      <TableWrapper>
        <Table unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Beneficiary</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>
                Total value
              </Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>
                Proposal count
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index}>
                  <Table.Cell>
                    <User address={item.beneficiary} />
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <Balance
                      value={item.value}
                      usdt={item.fiatValue}
                      reverse
                      isUnitPrice={false}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <Text>{item.count}</Text>
                  </Table.Cell>
                </TableRow>
              ))
            ) : (
              <TableNoDataCell />
            )}
          </Table.Body>
        </Table>
      </TableWrapper>
      {/* </Wrapper> */}
    </CardWrapper>
  );
};

export default BeneficiaryTable;
