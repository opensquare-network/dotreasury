import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading.js"
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";
import TableNoDataCell from "../../components/TableNoDataCell";
import Text from "../../components/Text";
import NameCell from "./NameCell";
import DateCell from "./DateCell";

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

const TipsTable = ({ data, loading }) => {
  const history = useHistory();

  const onClickRow = (index) => {
    if (window.innerWidth < 1140) {
      history.push(`/projects/${index}`);
    }
  }

  return (
    <Wrapper>
      <TableLoading loading={loading}>
        <StyledTable striped selectable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Proposals</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Expense</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Start</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>End</Table.HeaderCell>
              <Table.HeaderCell className="hidden" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(data &&
              data.length > 0 &&
              data.map((item, index) => (
                <Table.Row key={index} onClick={() => onClickRow(index)}>
                  <Table.Cell>
                    <NameCell icon={item.icon} name={item.name} />
                  </Table.Cell>
                  <Table.Cell className="description-cell">
                    <Text>{item.description}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <Text>{item.proposals}</Text>
                  </Table.Cell>
                  <Table.Cell className="balance-cell" textAlign={"right"}>
                    <Balance value={item.expense} />
                  </Table.Cell>
                  <Table.Cell className="date-cell">
                    <DateCell date={item.start} />
                  </Table.Cell>
                  <Table.Cell className="date-cell">
                    <DateCell date={item.end} />
                  </Table.Cell>
                  <Table.Cell className="link-cell hidden">
                    <NavLink to={`/projects/${index}`}>
                      <RightButton />
                    </NavLink>
                  </Table.Cell>
                </Table.Row>
              ))) || (
                <TableNoDataCell />
            )}
          </Table.Body>
        </StyledTable>
      </TableLoading>
    </Wrapper>
  );
};

export default TipsTable;
