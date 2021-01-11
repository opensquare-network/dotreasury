import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
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
import User from "../../components/User";
import Balance from "../../components/Balance";
import Voter from "../../components/Voter";
import Proposer from "../../components/Proposer";
import polkassemblyApi from "../../services/polkassembly";
import TimelineCommentWrapper from "../../components/TimelineCommentWrapper";

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

async function processTimeline(proposalDetail) {
  return [{
    name: "Proposed",
    extrinsicIndexer: proposalDetail.indexer || {},
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
      polkassembly: polkassemblyApi.getMotionUrl(motion.index),
      subTimeline: (motion.timeline || []).map(item => ({
        name: (item.action === "Propose" ? `Motion #${motion.index}` : item.action),
        extrinsicIndexer: item.extrinsic.extrinsicIndexer,
        fields: (() => {
          if (item.action === "Propose") {
            const [proposer, , , threshold] = item.eventData;
            const ayes = motion.voting?.ayes?.length || 0;
            const nays = motion.voting?.nays?.length || 0;
            return [{
              value: <Proposer address={proposer} agree={motion.result && motion.result === "Approved"} value={motion.method} threshold={threshold} ayes={ayes} nays={nays} />
            }]
          } else if (item.action === "Vote") {
            const [voter, , agree] = item.eventData;
            return [{
              value: <Voter address={voter} agree={agree} value={agree ? "Aye" : "Nay"} />
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
    })),
    ...(proposalDetail.latestState?.state === "Awarded" ? [{
      name: "Awarded",
      eventIndexer: proposalDetail.latestState?.indexer || {},
      fields: [{
        title: "Beneficiary",
        value: <User address={proposalDetail.latestState?.data[2]} />
      }, {
        title: "Balance",
        value: <Balance value={proposalDetail.latestState?.data[1]} />
      }]
    }] : [])
  ]
}

const ProposalDetail = () => {
  const history = useHistory();
  const { proposalIndex } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    dispatch(fetchProposalDetail(proposalIndex));
  }, [dispatch, proposalIndex]);

  const loadingProposalDetail = useSelector(loadingProposalDetailSelector);
  const proposalDetail = useSelector(proposalDetailSelector);

  useEffect(() => {
    (async () => {
      setTimelineData(await processTimeline(proposalDetail));
    })();
  }, [proposalDetail]);

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
      <RelatedLinks type="proposals" index={proposalIndex} />
      <TimelineCommentWrapper>
        <Timeline
          data={timelineData}
          loading={loadingProposalDetail}
        />
        <Comment />
      </TimelineCommentWrapper>
    </>
  );
};

export default ProposalDetail;
