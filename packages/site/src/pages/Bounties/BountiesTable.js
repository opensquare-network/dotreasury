import React from "react";
import styled from "styled-components";
import { NavLink, useHistory } from "react-router-dom";
import { Dimmer, Segment, Image } from "semantic-ui-react";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import User from "../../components/User";
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import PairTextVertical from "../../components/PairTextVertical";
import TableNoDataCell from "../../components/TableNoDataCell";
import { scanHeightSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.div`
  overflow-x: scroll;

  .ui.segment {
    padding: 0;
    border: 0;
    width: fit-content;
    min-width: 100%;
  }

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

const BountiesTable = ({ data, loading }) => {
  const history = useHistory();
  const scanHeight = useSelector(scanHeightSelector);

  const onClickRow = (bountyIndex) => {
    if (window.innerWidth < 1140) {
      history.push(`/bounties/${bountyIndex}`);
    }
  }

  return (
    <Wrapper>
      <Segment>
        <Dimmer active={loading} inverted>
          <Image src="/imgs/loading.svg" />
        </Dimmer>
        <StyledTable striped selectable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Curator</Table.HeaderCell>
              <Table.HeaderCell>Beneficiary</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Update due</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Payout due</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Value</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Status</Table.HeaderCell>
              <Table.HeaderCell className="hidden" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(data &&
              data.length > 0 &&
              data.map((item, index) => (
                <Table.Row key={index} onClick={() => onClickRow(item.bountyIndex)}>
                  <Table.Cell className="user-cell">
                    { item.curator ? <User address={item.curator} /> : "--" }
                  </Table.Cell>
                  <Table.Cell className="user-cell">
                    { item.beneficiary ? <User address={item.beneficiary} /> : "--" }
                  </Table.Cell>
                  <Table.Cell className="title-cell">
                    <Text>{item.title}</Text>
                  </Table.Cell>
                  <Table.Cell className="update-due-cell" textAlign={"right"}>
                    { item.updateDue
                        ? <PairTextVertical
                            value={item.updateDue}
                            detail={`${item.updateDue - scanHeight} blocks`}
                            />
                        : "--"
                    }
                  </Table.Cell>
                  <Table.Cell className="payout-due-cell" textAlign={"right"}>
                    <TextMinor>{"--"}</TextMinor>
                  </Table.Cell>
                  <Table.Cell className="balance-cell" textAlign={"right"}>
                    <Balance value={item.value} />
                  </Table.Cell>
                  <Table.Cell textAlign={"right"}>
                    <Text>{item.latestState?.state}</Text>
                  </Table.Cell>
                  <Table.Cell className="link-cell hidden">
                    <NavLink to={`/bounties/${item.bountyIndex}`}>
                      <RightButton />
                    </NavLink>
                  </Table.Cell>
                </Table.Row>
              ))) || (
                <TableNoDataCell />
            )}
          </Table.Body>
        </StyledTable>
      </Segment>
    </Wrapper>
  );
};

export default BountiesTable;
