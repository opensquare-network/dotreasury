import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import RightButton from "../../components/RightButton";
import TableNoDataCell from "../../components/TableNoDataCell";
import Text from "../../components/Text";
import NameCell from "./NameCell";
import DateCell from "./DateCell";
import Card from "../../components/Card";
import ProjectProposals from "../../components/ProjectProposals";
import ProjectExpense from "../../components/ProjectExpense";

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

  .balance-cell {
    .project-expense-wrapper {
      justify-content: flex-end;
    }
  }
`;

const TipsTable = ({ data, loading, header, footer }) => {
  const history = useHistory();

  const onClickRow = (id) => {
    if (window.innerWidth < 1140) {
      history.push(`/projects/${id}`);
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
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>
                    Proposals
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>
                    Expense
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign={"right"}>Start</Table.HeaderCell>
                  {/* <Table.HeaderCell textAlign={"right"}>End</Table.HeaderCell> */}
                  <Table.HeaderCell className="hidden" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(data &&
                  data.length > 0 &&
                  data.map((item, index) => (
                    <Table.Row key={index} onClick={() => onClickRow(item.id)}>
                      <Table.Cell>
                        <NameCell logo={item.logo} name={item.name} />
                      </Table.Cell>
                      <Table.Cell className="description-cell">
                        <Text>{item.title || item.description}</Text>
                      </Table.Cell>
                      <Table.Cell textAlign={"right"}>
                        <ProjectProposals
                          dotProposalsCount={item.fundsCount.polkadot}
                          ksmProposalsCount={item.fundsCount.kusama}
                        />
                      </Table.Cell>
                      <Table.Cell className="balance-cell" textAlign={"right"}>
                        <ProjectExpense
                          expenseDot={item.fundsValue.polkadot}
                          expenseKsm={item.fundsValue.kusama}
                          dollar={item.fiatValue}
                        />
                      </Table.Cell>
                      <Table.Cell className="date-cell">
                        <DateCell date={item.startTime} />
                      </Table.Cell>
                      <Table.Cell className="link-cell hidden">
                        <NavLink to={`/projects/${item.id}`}>
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
