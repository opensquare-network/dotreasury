import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import dayjs from "dayjs";
import { Dimmer, Segment, Image } from "semantic-ui-react";

import Table from "../../components/Table";
import User from "../../components/User/Index";
import Balance from "../../components/Balance";
import RightButton from "../../components/RightButton";
import PairTextVertical from "../../components/PairTextVertical";
import ReasonText from "./ReasonText";
import { TipStatus } from "../../constants";

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

const TipsTable = ({ data, loading }) => {
  const history = useHistory();

  const onClickRow = (height, hash) => {
    if (height && hash) {
      if (window.innerWidth < 1140) {
        history.push(`/tips/${height}_${hash}`);
      }
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
              <Table.HeaderCell>Beneficiary</Table.HeaderCell>
              <Table.HeaderCell className="hidden">Finder</Table.HeaderCell>
              <Table.HeaderCell>Reason</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Value</Table.HeaderCell>
              <Table.HeaderCell textAlign={"right"}>Status</Table.HeaderCell>
              <Table.HeaderCell className="hidden" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(data &&
              data.length > 0 &&
              data.map((item, index) => (
                <Table.Row key={index} onClick={() => onClickRow(item.proposeAtBlockHeight, item.hash)}>
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
                    { item.showStatus === TipStatus.Retracted
                        ? '--'
                        : <Balance value={item.medianValue} /> }
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
                        detail={dayjs(parseInt(item.latestState.time)).format(
                          "YYYY-MM-DD HH:mm"
                        )}
                      />
                    ) : (
                      item.showStatus === TipStatus.Tipping
                        ? `${item.showStatus} (${item.tipsCount})`
                        : item.showStatus
                    )}
                  </Table.Cell>
                  <Table.Cell className="link-cell hidden">
                    <NavLink to={`/tips/${item.proposeAtBlockHeight}_${item.hash}`}>
                      <RightButton />
                    </NavLink>
                  </Table.Cell>
                </Table.Row>
              ))) || (
              <Table.Row>
                <Table.Cell className="no-data" colSpan="6" textAlign="center">
                  No data
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </StyledTable>
      </Segment>
    </Wrapper>
  );
};

export default TipsTable;
