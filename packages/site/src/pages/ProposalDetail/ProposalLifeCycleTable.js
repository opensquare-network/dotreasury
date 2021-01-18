import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import TimeLabel from "../../components/TimeLabel";
import TimePeriod from "../../components/TimePeriod";
import DateShow from "../../components/DateShow";
import PolygonLabel from "../../components/PolygonLabel";
import ExplorerLink from "../../components/ExplorerLink";
import RelatedLInks from "../../components/RelatedLinks";

import { useIsMounted } from "../../utils/hooks"
import polkaassemblyApi from "../../services/polkassembly";
import { estimateBlocksTime } from "../../services/chainApi";

import {
  proposalDetailSelector,
} from "../../store/reducers/proposalSlice";
import { scanHeightSelector } from "../../store/reducers/chainSlice";

import { mrgap } from "../../styles";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${css`${mrgap("16px")}`}
`;

const ProposalLifeCycleTable = ({ loading }) => {
  const proposalDetail = useSelector(proposalDetailSelector);
  const [proposalUrl, setProposalUrl] = useState(null);
  const isMounted = useIsMounted()

  useEffect(() => {
    (async () => {
      if (proposalDetail) {
        const url = await polkaassemblyApi.getProposalUrl(proposalDetail.proposalIndex);
        if (isMounted.current) {
          setProposalUrl(url);
        }
      } else {
        setProposalUrl(null);
      }
    })();
  }, [proposalDetail, isMounted]);

  const scanHeight = useSelector(scanHeightSelector);

  const [votingEnd, setVotingEnd] = useState(null);
  useEffect(() => {
    if (proposalDetail && scanHeight > 0) {
      const ongoingMotions = (proposalDetail.motions || []).filter(m => !m.result && m.voting?.end > scanHeight);
      ongoingMotions.sort((a, b) => a.voting?.end - b.voting?.end);
      const firstOngoingMotion = ongoingMotions[0];

      if (firstOngoingMotion) {
        estimateBlocksTime(firstOngoingMotion.voting?.end - scanHeight).then(blocksTime => {
          if (isMounted.current) {
            setVotingEnd({
              atBlock: firstOngoingMotion.voting?.end,
              duration: blocksTime
            });
          }
        });
      } else {
        setVotingEnd(null);
      }
    }
  }, [proposalDetail, scanHeight, isMounted]);

  return (
    <TableLoading loading={loading}>
      <Table striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Proposal Life Cycle</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <TableCell title={"Created"}>
                <FlexWrapper>
                  <div><DateShow value={proposalDetail.proposeTime} /></div>
                  <ExplorerLink href={`/block/${proposalDetail.proposeAtBlockHeight}`}>
                    <PolygonLabel value={proposalDetail.proposeAtBlockHeight} />
                  </ExplorerLink>
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <TableCell title="Status">
                <FlexWrapper>
                  <div>{proposalDetail.latestState?.state}</div>
                  <TimeLabel value={proposalDetail.latestState?.time} />
                </FlexWrapper>
              </TableCell>
            </Table.Cell>
          </Table.Row>
          {
            proposalUrl
            && <Table.Row>
              <Table.Cell>
                <TableCell title="Discusssion">
                  <RelatedLInks links={[
                    {
                      link: proposalUrl,
                      description: "Treasury proposal discusssion"
                    }
                  ]} />
                </TableCell>
              </Table.Cell>
            </Table.Row>
          }
          {
            votingEnd
            && <Table.Row>
              <Table.Cell>
                <TableCell title="Voting End">
                  <FlexWrapper>
                    <div>{`#${votingEnd.atBlock}`}</div>
                    <TimePeriod time={votingEnd.duration} />
                  </FlexWrapper>
                </TableCell>
              </Table.Cell>
            </Table.Row>
          }
        </Table.Body>
      </Table>
    </TableLoading>
  );
};

export default ProposalLifeCycleTable;
