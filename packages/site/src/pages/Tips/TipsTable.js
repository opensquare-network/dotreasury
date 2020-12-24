import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

import Table from "../../components/Table";
import User from "../../components/User/Index";
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";
import Status from "./Status";
import ReasonText from "./ReasonText";

const Wrapper = styled.div`
  overflow-x: scroll;
`;

const TipsTable = ({ data }) => {
  return (
    <Wrapper>
      <Table striped selectable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign={"center"}>
              Beneficiary
            </Table.HeaderCell>
            <Table.HeaderCell textAlign={"center"}>Finder</Table.HeaderCell>
            <Table.HeaderCell>Reason</Table.HeaderCell>
            <Table.HeaderCell textAlign={"right"}>Value</Table.HeaderCell>
            <Table.HeaderCell textAlign={"right"}>Status</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data &&
            data.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell className="user-cell">
                  <User
                    name={item.beneficiary.name}
                    address={item.beneficiary.address}
                  />
                </Table.Cell>
                <Table.Cell className="user-cell">
                  <User name={item.finder.name} address={item.finder.address} />
                </Table.Cell>
                <Table.Cell>
                  <ReasonText>{item.reason}</ReasonText>
                </Table.Cell>
                <Table.Cell className="balance-cell" textAlign={"right"}>
                  <Balance
                    value={item.balance.value}
                    currency={item.balance.currency}
                  />
                </Table.Cell>
                <Table.Cell className="status-cell" textAlign={"right"}>
                  <Status status={item.status.status} time={item.status.time} />
                </Table.Cell>
                <Table.Cell className="link-cell">
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
