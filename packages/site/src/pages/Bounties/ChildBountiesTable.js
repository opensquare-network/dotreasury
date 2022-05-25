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

const ProposeTimeWrapper = styled.div``;

const CapText = styled(Text)`
  text-transform: capitalize;
  white-space: nowrap;
`;

const TableRow = styled(Table.Row)`
  height: 50px;
`;

const getStateWithVotingAyes = (item) => {
  const state = item.state?.state;
  const isVoting = ["ApproveVoting", "RejectVoting"].includes(state);

  if (isVoting) {
    const nAyes = item.state.data.motionVoting?.ayes?.length;
    if (nAyes !== undefined) {
      return state + ` (${nAyes})`;
    }
  }
  return state;
};

const BountiesTable = ({ data, loading, header, footer }) => {
  const history = useHistory();
  const symbol = useSelector(chainSymbolSelector);

  const onClickRow = (index) => {
    if (window.innerWidth < 1140) {
      history.push(`/${symbol.toLowerCase()}/child-bounties/${index}`);
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
                      onClick={() => onClickRow(item.index)}
                    >
                      <Table.Cell className="index-cell">
                        <TextMinor>{`#${item.index}`}</TextMinor>
                      </Table.Cell>
                      <Table.Cell className="propose-time-cell">
                        <ProposeTimeWrapper>
                          <TextMinor>
                            {dayjs(parseInt(item.indexer?.blockTime)).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </TextMinor>
                          <ExplorerLink
                            href={`/block/${item.indexer?.blockHeight}`}
                          >
                            <PolygonLabel
                              fontSize={12}
                              value={item.indexer?.blockHeight}
                            />
                          </ExplorerLink>
                        </ProposeTimeWrapper>
                      </Table.Cell>
                      <Table.Cell className="user-cell">
                        {item.curator ? <User address={item.curator} /> : "--"}
                      </Table.Cell>
                      <Table.Cell className="title-cell">
                        <Text>{item.description}</Text>
                      </Table.Cell>
                      <Table.Cell className="balance-cell" textAlign={"right"}>
                        <Balance
                          value={item.value}
                          currency={symbol}
                          usdt={item.symbolPrice}
                        />
                      </Table.Cell>
                      <Table.Cell textAlign={"right"}>
                        <CapText>{getStateWithVotingAyes(item)}</CapText>
                      </Table.Cell>
                      <Table.Cell className="link-cell hidden">
                        <NavLink
                          to={`/${symbol.toLowerCase()}/child-bounties/${
                            item.index
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
