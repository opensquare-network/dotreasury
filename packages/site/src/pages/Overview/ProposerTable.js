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
import { TEXT_DARK_MAJOR } from "../../constants";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

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

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
`;

const LinkButton = styled(TextMinor)`
  display: flex;
  :hover {
    color: ${TEXT_DARK_MAJOR};
    & > :last-child {
      -webkit-filter: grayscale(0);
      filter: grayscale(0);
      opacity: 1;
    }
  }
`;

const ProposerTable = () => {
  const symbol = useSelector(chainSymbolSelector)?.toLowerCase();
  const overview = useSelector(overviewSelector);
  const data = overview.bestTipFinders || [];

  return (
    <CardWrapper>
      <TitleContainer>
        <Title>Top Tip Finders</Title>
        <NavLink to={`/${symbol}/tip-finders`}>
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
                <Table.HeaderCell textAlign={"right"}>Count</Table.HeaderCell>
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
                      <User address={item.finder} />
                    </Table.Cell>
                    <Table.Cell textAlign={"right"}>
                      <Text>{item.count}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign={"right"}>
                      <Balance
                        value={item.value}
                        usdt={item.fiatValue}
                        isUnitPrice={false}
                      />
                    </Table.Cell>
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
