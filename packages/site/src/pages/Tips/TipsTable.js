import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import dayjs from "dayjs";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading.js";
import User from "../../components/User";
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";
import PairTextVertical from "../../components/PairTextVertical";
import ReasonText from "./ReasonText";
import { TipStatus } from "../../constants";
import TableNoDataCell from "../../components/TableNoDataCell";
import ReasonLink from "./ReasonLink";
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

const TipsTable = ({ data, loading, header, footer }) => {
  const history = useHistory();
  const symbol = useSelector(chainSymbolSelector);

  const onClickRow = (height, hash) => {
    if (height && hash) {
      if (window.innerWidth < 1140) {
        history.push(`/${symbol.toLowerCase()}/tips/${height}_${hash}`);
      }
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
                  <Table.HeaderCell>Beneficiary</Table.HeaderCell>
                  <Table.HeaderCell className="hidden">Finder</Table.HeaderCell>
                  <Table.HeaderCell>Reason</Table.HeaderCell>
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
                      onClick={() =>
                        onClickRow(item.proposeAtBlockHeight, item.hash)
                      }
                    >
                      <Table.Cell className="user-cell">
                        <User address={item.beneficiary} />
                      </Table.Cell>
                      <Table.Cell className="user-cell hidden">
                        <User address={item.finder} />
                      </Table.Cell>
                      <Table.Cell>
                        <ReasonText>
                          <ReasonLink text={item.reason} />
                        </ReasonText>
                      </Table.Cell>
                      <Table.Cell className="balance-cell" textAlign={"right"}>
                        {item.showStatus === TipStatus.Retracted ? (
                          "--"
                        ) : (
                          <Balance
                            value={item.medianValue}
                            currency={symbol}
                            usdt={item.symbolPrice}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell
                        className={`status-cell ${
                          item.showTime ? "short-padding" : ""
                        }`}
                        textAlign={"right"}
                      >
                        {item.showTime ? (
                          <PairTextVertical
                            value={item.showStatus}
                            detail={dayjs(
                              parseInt(item.latestState.time)
                            ).format("YYYY-MM-DD HH:mm")}
                          />
                        ) : item.showStatus === TipStatus.Tipping ? (
                          `${item.showStatus} (${item.tipsCount})`
                        ) : (
                          item.showStatus
                        )}
                      </Table.Cell>
                      <Table.Cell className="link-cell hidden">
                        <NavLink
                          to={`/${symbol.toLowerCase()}/tips/${
                            item.proposeAtBlockHeight
                          }_${item.hash}`}
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

export default TipsTable;
