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
import { NavLink } from "react-router-dom";
import TextMinor from "../../components/TextMinor";
import GrayImage from "../../components/GrayImage";
import { USER_ROLES } from "../../constants";

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

const Wrapper = styled.div`
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow: scroll;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`;

const TableRow = styled(Table.Row)`
  height: 50px;
`;

const TableCell = styled(Table.Cell)`
  width: 160px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
`;

const LinkButton = styled(TextMinor)`
  display: flex;
  :hover {
    color: var(--textPrimary);
    & > :last-child {
      -webkit-filter: grayscale(0);
      filter: grayscale(0);
      opacity: 1;
    }
  }
`;

const ProposerTable = () => {
  const overview = useSelector(overviewSelector);
  const data = overview.bestTipFinders || [];

  return (
    <CardWrapper>
      <TitleContainer>
        <Title>Top Tip Finders</Title>
        <NavLink to={"/tip-finders"}>
          <LinkButton>
            View All
            <GrayImage src="/imgs/caret-right.svg" width={24} />
          </LinkButton>
        </NavLink>
      </TitleContainer>
      <Wrapper>
        <TableWrapper>
          <Table unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Finder</Table.HeaderCell>
                <Table.HeaderCell textAlign={"right"}>
                  Tip Count
                </Table.HeaderCell>
                <Table.HeaderCell textAlign={"right"}>
                  Total value
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow key={index}>
                    <Table.Cell>
                      <User role={USER_ROLES.Proposer} address={item.finder} />
                    </Table.Cell>
                    <TableCell textAlign={"right"}>
                      <Text>{item.count}</Text>
                    </TableCell>
                    <TableCell textAlign={"right"}>
                      <Balance
                        value={item.value}
                        usdt={item.fiatValue}
                        isUnitPrice={false}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableNoDataCell />
              )}
            </Table.Body>
          </Table>
        </TableWrapper>
      </Wrapper>
    </CardWrapper>
  );
};

export default ProposerTable;
