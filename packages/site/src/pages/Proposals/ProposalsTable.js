import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import dayjs from "dayjs";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import User from "../../components/User";
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";
import TextMinor from "../../components/TextMinor";
import PairTextVertical from "../../components/PairTextVertical";
import PolygonLabel from "../../components/PolygonLabel";
import ExplorerLink from "../../components/ExplorerLink";
import TableNoDataCell from "../../components/TableNoDataCell";
import RelatedLInks from "../../components/RelatedLinks";
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

const getStateWithVotingAyes = (item) => {
  const state = item.latestState.state;
  const isProposalVoting = ["ApproveVoting", "RejectVoting"].includes(state);

  if (isProposalVoting) {
    const nAyes = item.latestState.motionVoting?.ayes?.length;
    if (nAyes !== undefined) {
      return state + ` (${nAyes})`;
    }
  }

  return state;
};

const ProposalsTable = ({ data, loading, header, footer }) => {
  const history = useHistory();
  const symbol = useSelector(chainSymbolSelector);

  const onClickRow = (proposalIndex) => {
    if (window.innerWidth < 1140) {
      history.push(`/${symbol.toLowerCase()}/proposals/${proposalIndex}`);
    }
  };

  return (
    <CardWrapper>
      {header}
      <Wrapper>
        <TableWrapper>
          <TableLoading loading={loading}>
            <StyledTable striped selectable unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Index</Table.HeaderCell>
                  <Table.HeaderCell>Propose time</Table.HeaderCell>
                  <Table.HeaderCell>Beneficiary</Table.HeaderCell>
                  <Table.HeaderCell>Proposer</Table.HeaderCell>
                  <Table.HeaderCell>Related links</Table.HeaderCell>
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
                    <Table.Row
                      key={index}
                      onClick={() => onClickRow(item.proposalIndex)}
                    >
                      <Table.Cell className="index-cell">
                        <TextMinor>{`#${item.proposalIndex}`}</TextMinor>
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
                        <User address={item.beneficiary} />
                      </Table.Cell>
                      <Table.Cell className="user-cell">
                        <User address={item.proposer} />
                      </Table.Cell>
                      <Table.Cell className="related-links-cell">
                        <RelatedLInks links={item.links} />
                      </Table.Cell>
                      <Table.Cell textAlign={"right"}>
                        <Balance
                          value={item.value}
                          currency={symbol}
                          usdt={item.symbolPrice}
                        />
                      </Table.Cell>
                      <Table.Cell className="status-cell" textAlign={"right"}>
                        <PairTextVertical
                          value={getStateWithVotingAyes(item)}
                          detail={dayjs(parseInt(item.latestState.time)).format(
                            "YYYY-MM-DD HH:mm"
                          )}
                        />
                      </Table.Cell>
                      <Table.Cell className="link-cell hidden">
                        <NavLink
                          to={`/${symbol.toLowerCase()}/proposals/${
                            item.proposalIndex
                          }`}
                        >
                          <RightButton />
                        </NavLink>
                      </Table.Cell>
                    </Table.Row>
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

export default ProposalsTable;
