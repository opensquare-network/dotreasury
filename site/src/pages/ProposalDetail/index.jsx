import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  setProposalDetail,
  fetchProposalDetail,
  loadingProposalDetailSelector,
  proposalDetailSelector,
} from "../../store/reducers/proposalSlice";
import { scanHeightSelector } from "../../store/reducers/chainSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import {
  fetchDescription,
  setDescription,
} from "../../store/reducers/descriptionSlice";

import InformationTable from "./InformationTable";
import Timeline from "../Timeline";
import Comment from "../Comment";
import RelatedLinks from "../RelatedLinks";
import ProposalLifeCycleTable from "./ProposalLifeCycleTable";
import TimelineCommentWrapper from "../../components/TimelineCommentWrapper";
import DetailGoBack from "../components/DetailGoBack";
import DetailTableWrapper from "../../components/DetailTableWrapper";
import Rate from "../../components/Rate";
import { processTimeline } from "./timeline";

const ProposalDetail = () => {
  const { proposalIndex } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchProposalDetail(proposalIndex));
    return () => {
      dispatch(setProposalDetail({}));
    };
  }, [dispatch, proposalIndex]);

  useEffect(() => {
    dispatch(fetchDescription("proposal", proposalIndex));
    return () => {
      dispatch(setDescription());
    };
  }, [dispatch, proposalIndex]);

  const loadingProposalDetail = useSelector(loadingProposalDetailSelector);
  const proposalDetail = useSelector(proposalDetailSelector);
  const scanHeight = useSelector(scanHeightSelector);

  useEffect(() => {
    setTimelineData(processTimeline(proposalDetail, scanHeight));
  }, [proposalDetail, scanHeight]);

  return (
    <>
      <DetailGoBack />
      <DetailTableWrapper title="Proposal" desc={`#${proposalIndex}`}>
        <InformationTable
          loading={loadingProposalDetail}
          proposalIndex={proposalIndex}
          proposer={proposalDetail?.proposer}
        />
        <ProposalLifeCycleTable loading={loadingProposalDetail} />
        <RelatedLinks
          type="proposal"
          index={parseInt(proposalIndex)}
          owner={proposalDetail?.proposer}
        />
      </DetailTableWrapper>
      <TimelineCommentWrapper>
        <Timeline data={timelineData} loading={loadingProposalDetail} />
        <div>
          <Rate type="proposal" index={parseInt(proposalIndex)} />
          <Comment type="proposal" index={parseInt(proposalIndex)} />
        </div>
      </TimelineCommentWrapper>
    </>
  );
};

export default ProposalDetail;
