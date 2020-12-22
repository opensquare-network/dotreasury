import React from "react";
import { NavLink } from "react-router-dom";

import Table from "../../components/Table";
import User from "../../components/User";
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";
import Status from "./Status";

const TipsTable = ({ data }) => {
  return (
    <Table striped selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign={"center"}>Beneficiary</Table.HeaderCell>
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
                <User name={item.beneficiary.name} />
              </Table.Cell>
              <Table.Cell className="user-cell">
                <User name={item.finder.name} />
              </Table.Cell>
              <Table.Cell>{item.reason}</Table.Cell>
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
  );
};

export default TipsTable;
