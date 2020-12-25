import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import dayjs from "dayjs";

import Table from "../../components/Table";
import User from "../../components/User/Index";
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";
import PairTextVertical from "../../components/PairTextVertical";
import ReasonText from "./ReasonText";

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

const TipsTable = ({ data }) => {
  const history = useHistory();

  const onClickRow = () => {
    if (window.innerWidth < 1140) {
      history.push("/detail");
    }
  };

  return (
    <Wrapper>
      <Table striped selectable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Beneficiary</Table.HeaderCell>
            <Table.HeaderCell className="hidden">Finder</Table.HeaderCell>
            <Table.HeaderCell>Reason</Table.HeaderCell>
            <Table.HeaderCell textAlign={"right"}>Value</Table.HeaderCell>
            <Table.HeaderCell textAlign={"right"}>Status</Table.HeaderCell>
            <Table.HeaderCell className="hidden" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data &&
            data.map((item, index) => (
              <Table.Row key={index} onClick={onClickRow}>
                <Table.Cell className="user-cell">
                  <User address={item.beneficiary} />
                </Table.Cell>
                <Table.Cell className="user-cell hidden">
                  <User address={item.finder} />
                </Table.Cell>
                <Table.Cell>
                  <ReasonText>{item.reason}</ReasonText>
                </Table.Cell>
                <Table.Cell className="balance-cell" textAlign={"right"}>
                  <Balance value={item.medianValue} />
                </Table.Cell>
                <Table.Cell className="status-cell" textAlign={"right"}>
                  <PairTextVertical
                    value={item.latestState.state}
                    detail={dayjs(item.latestState.time).format(
                      "YYYY-MM-DD HH:mm"
                    )}
                  />
                </Table.Cell>
                <Table.Cell className="link-cell hidden">
                  <NavLink to="/detail">
                    <RightButton />
                  </NavLink>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Wrapper>
  );
};

export default TipsTable;
