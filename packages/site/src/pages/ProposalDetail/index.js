import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import { Divider, Image } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import {
  fetchProposalDetail,
  proposalDetailSelector,
  loadingProposalDetailSelector,
} from "../../store/reducers/proposalSlice";

import InformationTable from "./InformationTable";
import Timeline from "../Timeline";
import Comment from "../Comment";
import RelatedLinks from "../RelatedLinks";
import Title from "../../components/Title";
import ProposalLifeCycleTable from "./ProposalLifeCycleTable";
import User from "../../components/User/Index";
import Balance from "../../components/Balance";
import VoterItem from "./Voter";
import Proposer from "./Proposer";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  div:first-child {
    cursor: pointer;
  }
`;

const TableWrapper = styled.div`
  display: grid;
  gap: 16px;
  @media screen and (min-width: 556px) {
    grid-template-columns: repeat(auto-fit, minmax(556px, 1fr));
  }
  @media screen and (max-width: 556px) {
    grid-template-columns: repeat(1fr);
  }
`;

const TimelineCommentWrapper = styled.div`
  margin-top: 20px;
  display: grid;
  gap: 24px;
  @media screen and (min-width: 1128px) {
    grid-template-columns: repeat(3, 1fr);
    & > div:first-child {
      grid-column: 1 / 2;
    }
    & > div:last-child {
      grid-column: 2 / 4;
    }
  }
`;

function processTimeline(proposalDetail) {
  return [{
    name: "Proposed",
    extrinsicIndexer: {
      blockTime: proposalDetail.proposeTime,
    },
    fields: [{
      title: "Proposer",
      value: <User address={proposalDetail.proposer} />
    }, {
      title: "Beneficiary",
      value: <User address={proposalDetail.beneficiary} />
    }, {
      title: "Value",
      value: <Balance value={proposalDetail.value} />
    }]
  },
  ...(proposalDetail.motions || []).map(motion => ({
    subTimeline: (motion.timeline || []).map(item => ({
      name: item.action,
      extrinsicIndexer: item.extrinsic.extrinsicIndexer,
      fields: (() => {
        if (item.action === "Propose") {
          const [proposer, , , threshold] = item.eventData;
          const ayes = motion.voting?.ayes?.length || 0;
          return [{
            value: <Proposer address={proposer} result={motion.result} value={motion.method} threshold={threshold} ayes={ayes} />
          }]
        } else if (item.action === "Vote") {
          const [voter, , agree] = item.eventData;
          return [{
            value: <VoterItem address={voter} agree={agree} value={agree ? "Aye" : "Nay"} />
          }]
        } else if (item.action === "Close") {
          return [{
            title: motion.result
          }]
        } else {
          return [];
        }
      })(),
    }))
  }))]
}

const ProposalDetail = () => {
  const history = useHistory();
  const { proposalIndex } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProposalDetail(proposalIndex));
  }, [dispatch, proposalIndex]);

  const loadingProposalDetail = useSelector(loadingProposalDetailSelector);
  const proposalDetail = useSelector(proposalDetailSelector);

  return (
    <>
      <HeaderWrapper>
        <div onClick={() => history.goBack()}>
          <Image src="/imgs/left-arrow.svg" width={"32px"} height={"32px"} />
        </div>
        <Title>Detail</Title>
      </HeaderWrapper>
      <TableWrapper>
        <InformationTable loading={loadingProposalDetail} />
        <ProposalLifeCycleTable loading={loadingProposalDetail} />
      </TableWrapper>
      <RelatedLinks />
      <Divider />
      <TimelineCommentWrapper>
        <Timeline
          data={processTimeline(proposalDetail)}
          loading={loadingProposalDetail}
        />
        <Comment />
      </TimelineCommentWrapper>
    </>
  );
};

export default ProposalDetail;
