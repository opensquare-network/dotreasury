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

const Wrapper = styled.div`
  overflow-x: scroll;

  @media screen and (max-width: 1140px) {
    position: relative;
    left: -16px;
    padding: 0 16px;
    width: calc(100% + 32px);
    .hidden {
      display: none;
    }
  }
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

const ProposalsTable = ({ data, loading }) => {
  const history = useHistory();
  const symbol = useSelector(chainSymbolSelector);

  const onClickRow = (proposalIndex) => {
    if (window.innerWidth < 1140) {
      history.push(`/${symbol.toLowerCase()}/proposals/${proposalIndex}`);
    }
  };

  return (
    <Wrapper>
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
              <Table.HeaderCell textAlign={"right"}>Status</Table.HeaderCell>
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
                    <Balance value={item.value} currency={symbol} />
                  </Table.Cell>
                  <Table.Cell className="status-cell" textAlign={"right"}>
                    <PairTextVertical
                      value={item.latestState.state}
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
    </Wrapper>
  );
};

export default ProposalsTable;
