import React, { useState } from "react";
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
import BeneficiaryContent from "./BeneficiaryContent";
import DescriptionCell from "./DescriptionCell";

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

const BeneficiarySwitch = styled.div`
  cursor: pointer;
  :hover {
    color: rgba(0, 0, 0, 0.9);
  }
`;

const getStateWithVotingAyes = (item) => {
  const { state: stateValue, name } = item.latestState;
  const state = stateValue || name;
  const isProposalVoting = ["ApproveVoting", "RejectVoting"].includes(state);

  if (isProposalVoting) {
    const nAyes = item.latestState.motionVoting?.ayes?.length;
    if (nAyes !== undefined) {
      return state + ` (${ nAyes })`;
    }
  }

  return state;
};

const ProposalsTable = ({ data, loading, header, footer }) => {
  const history = useHistory();
  const symbol = useSelector(chainSymbolSelector);
  const [isBeneficiary, setIsBeneficiary] = useState(true);

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
            <StyledTable unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Index</Table.HeaderCell>
                  <Table.HeaderCell>Propose time</Table.HeaderCell>
                  <Table.HeaderCell>
                    <BeneficiarySwitch
                      onClick={() => setIsBeneficiary(!isBeneficiary)}
                    >
                      {isBeneficiary ? "Beneficiary" : "Proposer"}
                    </BeneficiarySwitch>
                  </Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
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
                      <Table.Cell className="new-propose-time-cell">
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
                      <Table.Cell className="proposal-user-cell">
                        {isBeneficiary ? (
                          <User
                            address={item.beneficiary}
                            popupContent={
                              <BeneficiaryContent
                                proposerAddress={item.proposer}
                                beneficiaryAddress={item.beneficiary}
                              />
                            }
                          />
                        ) : (
                          <User
                            address={item.proposer}
                            popupContent={
                              <BeneficiaryContent
                                proposerAddress={item.proposer}
                                beneficiaryAddress={item.beneficiary}
                              />
                            }
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell className="proposal-description-cell">
                        <DescriptionCell description={item.description} />
                      </Table.Cell>
                      <Table.Cell className="proposal-related-links-cell">
                        <RelatedLInks links={item.links} />
                      </Table.Cell>
                      <Table.Cell
                        className="proposal-value-cell"
                        textAlign={"right"}
                      >
                        <Balance
                          value={item.value}
                          currency={symbol}
                          usdt={item.symbolPrice}
                        />
                      </Table.Cell>
                      <Table.Cell
                        className="proposal-status-cell"
                        textAlign={"right"}
                      >
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
