import React from "react";
import styled from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import dayjs from "dayjs";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import User from "../../components/User";
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import TableNoDataCell from "../../components/TableNoDataCell";
import PolygonLabel from "../../components/PolygonLabel";
import ExplorerLink from "../../components/ExplorerLink";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import Card from "../../components/Card";

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

const StyledTable = styled(Table)`
  .short-padding {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
  }
  .no-data {
    height: 120px !important;
  }
`;

const ProposeTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  p:first-child {
    min-width: 154px;
  }
`;

const CapText = styled(Text)`
  text-transform: capitalize;
`;

const TableRow = styled(Table.Row)`
  height: 50px;
`;

const BountiesTable = ({ data, loading, header, footer }) => {
  const history = useHistory();
  const symbol = useSelector(chainSymbolSelector);

  const onClickRow = (bountyIndex) => {
    if (window.innerWidth < 1140) {
      history.push(`/${symbol.toLowerCase()}/bounties/${bountyIndex}`);
    }
  };

  return (
    <CardWrapper>
      {header}
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <StyledTable unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Index</Table.HeaderCell>
                  <Table.HeaderCell>Propose Time</Table.HeaderCell>
                  <Table.HeaderCell>Curator</Table.HeaderCell>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>Value</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>
                    Status
                  </Table.HeaderCell>
                  <Table.HeaderCell className="hidden" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(data &&
                  data.length > 0 &&
                  data.map((item, index) => (
                    <TableRow
                      key={index}
                      onClick={() => onClickRow(item.bountyIndex)}
                    >
                      <Table.Cell className="index-cell">
                        <TextMinor>{`#${item.bountyIndex}`}</TextMinor>
                      </Table.Cell>
                      <Table.Cell className="propose-time-cell">
                        <ProposeTimeWrapper>
                          <TextMinor>
                            {dayjs(parseInt(item.proposeTime)).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </TextMinor>
                          <ExplorerLink
                            href={`/block/${item.proposeAtBlockHeight}`}
                          >
                            <PolygonLabel value={item.proposeAtBlockHeight} />
                          </ExplorerLink>
                        </ProposeTimeWrapper>
                      </Table.Cell>
                      <Table.Cell className="user-cell">
                        {item.curator ? <User address={item.curator} /> : "--"}
                      </Table.Cell>
                      <Table.Cell className="title-cell">
                        <Text>{item.title}</Text>
                      </Table.Cell>
                      <Table.Cell className="balance-cell" textAlign={"right"}>
                        <Balance
                          value={item.value}
                          currency={symbol}
                          usdt={item.symbolPrice}
                        />
                      </Table.Cell>
                      <Table.Cell textAlign={"right"}>
                        <CapText>{item.state?.state}</CapText>
                      </Table.Cell>
                      <Table.Cell className="link-cell hidden">
                        <NavLink
                          to={`/${symbol.toLowerCase()}/bounties/${
                            item.bountyIndex
                          }`}
                        >
                          <RightButton />
                        </NavLink>
                      </Table.Cell>
                    </TableRow>
                  ))) || <TableNoDataCell />}
              </Table.Body>
            </StyledTable>
          </TableLoading>
        </TableWrapper>
      </Wrapper>
      {footer}
    </CardWrapper>
  );
};

export default BountiesTable;
