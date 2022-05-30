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
  align-items: flex-start;
  flex-direction: column;
  p:first-child {
    min-width: 154px;
  }
  > :first-child {
    line-height: 22px;
    color: rgba(0, 0, 0, 0.9) !important;
  }
  > :last-child {
    * {
      font-size: 12px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.3);
    }
    img {
      width: 14px !important;
      height: 14px !important;
    }
  }
`;

const CapText = styled(Text)`
  text-transform: capitalize;
  white-space: nowrap;
`;

const TableRow = styled(Table.Row)`
  height: 50px;

  &.child {
    background-color: rgba(250, 250, 250, 1);
  }
`;

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

function TableExpandableRow({ type = "", item = {}, routable = true, symbol }) {
  const history = useHistory();

  const detailRoute = `/${symbol.toLowerCase()}/${type}/${item.bountyIndex}`;
  const onClickRow = () => {
    if (window.innerWidth < 1140) {
      history.push(detailRoute);
    }
  };

  return (
    <>
      <TableRow onClick={onClickRow}>
        <Table.Cell className="index-cell">
          <TextMinor>{`#${item.bountyIndex}`}</TextMinor>
        </Table.Cell>
        <Table.Cell className="index-cell">
          <NavLink to={`./bounties/${item.parentBountyId}`}>
            <TextMinor>{`#${item.parentBountyId}`}</TextMinor>
          </NavLink>
        </Table.Cell>
        <Table.Cell className="propose-time-cell">
          <ProposeTimeWrapper>
            <TextMinor>
              {dayjs(parseInt(item.proposeTime)).format("YYYY-MM-DD HH:mm:ss")}
            </TextMinor>
            <ExplorerLink href={`/block/${item.proposeAtBlockHeight}`}>
              <PolygonLabel fontSize={12} value={item.proposeAtBlockHeight} />
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
          <CapText>{getStateWithVotingAyes(item)}</CapText>
        </Table.Cell>
        {routable && (
          <Table.Cell className="link-cell hidden">
            {detailRoute && (
              <NavLink to={detailRoute}>
                <RightButton />
              </NavLink>
            )}
          </Table.Cell>
        )}
      </TableRow>
    </>
  );
}

const BountiesTable = ({ data, loading, header, footer, rowProps = {} }) => {
  const { routable = true } = rowProps;
  const symbol = useSelector(chainSymbolSelector);

  return (
    <CardWrapper>
      {header && <HeaderWrapper>{header}</HeaderWrapper>}
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <StyledTable unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Index</Table.HeaderCell>
                  <Table.HeaderCell>Parent</Table.HeaderCell>
                  <Table.HeaderCell>Propose Time</Table.HeaderCell>
                  <Table.HeaderCell>Curator</Table.HeaderCell>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>Value</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>
                    Status
                  </Table.HeaderCell>
                  {routable && <Table.HeaderCell className="hidden" />}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(data &&
                  data.length > 0 &&
                  data.map((item, index) => (
                    <TableExpandableRow
                      routable={routable}
                      type="child-bounties"
                      key={index}
                      item={item}
                      symbol={symbol}
                    />
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
