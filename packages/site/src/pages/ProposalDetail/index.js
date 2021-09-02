import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import {
  setProposalDetail,
  fetchProposalDetail,
  loadingProposalDetailSelector,
  proposalDetailSelector,
} from "../../store/reducers/proposalSlice";
import { scanHeightSelector } from "../../store/reducers/chainSlice";
import { chainSelector } from "../../store/reducers/chainSlice";

import InformationTable from "./InformationTable";
import Timeline from "../Timeline";
import Comment from "../Comment";
import RelatedLinks from "../RelatedLinks";
import ProposalLifeCycleTable from "./ProposalLifeCycleTable";
import User from "../../components/User";
import Balance from "../../components/Balance";
import Voter from "../../components/Voter";
import Proposer from "../../components/Proposer";
import BlocksTime from "../../components/BlocksTime";
import TimelineCommentWrapper from "../../components/TimelineCommentWrapper";
import DetailGoBack from "../components/DetailGoBack";
import { useChainRoute } from "../../utils/hooks";
import DetailTableWrapper from "../../components/DetailTableWrapper";
import Rate from "../../components/Rate";

const ValueWrapper = styled.span`
  margin-right: 4px;
  color: #1d253c;
`;

const UnitWrapper = styled.span`
  color: #1d253c;
`;

function isMotion(timelineItem) {
  return !!timelineItem.timeline;
}

function timelineItemHeight(timelineItem) {
  if (isMotion(timelineItem)) {
    return timelineItem.timeline[0].extrinsic.extrinsicIndexer.blockHeight;
  }

  if ("extrinsic" === timelineItem.type) {
    return timelineItem.extrinsicIndexer.blockHeight;
  }

  if ("event" === timelineItem.type) {
    return timelineItem.eventIndexer.blockHeight;
  }

  return timelineItem.indexer?.blockHeight;
}

function normalizeMotionTimelineItem(motion, scanHeight) {
  return {
    index: motion.index,
    defaultUnfold: !motion.result && motion.voting?.end >= scanHeight,
    // FIXME: && motion.treasuryProposalId !== 15
    expired:
      !motion.result &&
      motion.voting?.end < scanHeight &&
      motion.treasuryProposalId !== 15,
    end: motion.voting?.end,
    subTimeline: (motion.timeline || []).map((item) => ({
      name: item.action === "Propose" ? `Motion #${motion.index}` : item.action,
      extrinsicIndexer: item.extrinsic.extrinsicIndexer,
      fields: (() => {
        if (item.action === "Propose") {
          const [proposer, , , threshold] = item.eventData;
          let ayes, nays;
          if (motion.voting) {
            ayes = motion.voting?.ayes?.length;
            nays = motion.voting?.nays?.length || 0;
          } else {
            const votes = motion.timeline.filter(
              (item) => item.action === "Vote"
            );
            const map = votes.reduce(
              (result, { eventData: [voter, _, aye] }) => {
                result[voter] = aye;
                return result;
              },
              {}
            );
            const values = Object.values(map);
            ayes = values.filter((v) => v).length;
            nays = values.length - ayes;
          }

          const argItems = [];
          if (
            scanHeight > 0 &&
            !motion.result &&
            motion.voting?.end > scanHeight
          ) {
            const blocks = motion.voting?.end - scanHeight;
            argItems.push({
              title: "Voting end",
              value: (
                <BlocksTime
                  blocks={blocks}
                  ValueWrapper={ValueWrapper}
                  UnitWrapper={UnitWrapper}
                />
              ),
            });
          }

          return [
            {
              value: (
                <Proposer
                  address={proposer}
                  agree={motion.result && motion.result === "Approved"}
                  args={argItems}
                  value={motion.method}
                  threshold={threshold}
                  ayes={ayes}
                  nays={nays}
                />
              ),
            },
          ];
        } else if (item.action === "Vote") {
          const [voter, , agree] = item.eventData;
          return [
            {
              value: (
                <Voter
                  address={voter}
                  agree={agree}
                  value={agree ? "Aye" : "Nay"}
                />
              ),
            },
          ];
        } else if (item.action === "Close") {
          return [
            {
              title: motion.result,
            },
          ];
        } else {
          return [];
        }
      })(),
    })),
  };
}

function constructProposalProcessItem(item, symbolPrice) {
  let fields = [];

  if (item.name === "Proposed") {
    const { proposer, value, beneficiary } = item.args;
    fields = [
      {
        title: "Proposer",
        value: <User address={proposer} />,
      },
      {
        title: "Value",
        value: <Balance value={value} usdt={symbolPrice} horizontal />,
      },
      {
        title: "Beneficiary",
        value: <User address={beneficiary} />,
      },
    ];

    return {
      name: item.name,
      extrinsicIndexer: item.extrinsicIndexer,
      fields,
    };
  }

  if (item.name === "Rejected") {
    const { value } = item.args;
    return {
      name: item.name,
      eventIndexer: item.eventIndexer || item.indexer,
      fields: [
        {
          title: "Slashed",
          value: <Balance value={value} />,
        },
      ],
    };
  }

  if (item.name === "Awarded") {
    const { value, beneficiary } = item.args;
    return {
      name: item.name,
      eventIndexer: item.eventIndexer || item.indexer,
      fields: [
        {
          title: "Beneficiary",
          value: <User address={beneficiary} />,
        },
        {
          title: "Value",
          value: <Balance value={value} />,
        },
      ],
    };
  }
}

function processTimeline(proposalDetail, scanHeight) {
  const { timeline, motions } = proposalDetail;
  if (!timeline) {
    return [];
  }

  const allItems = [...timeline, ...motions];
  allItems.sort((a, b) => timelineItemHeight(a) - timelineItemHeight(b));

  return allItems.map((item) => {
    if (isMotion(item)) {
      return normalizeMotionTimelineItem(item, scanHeight);
    }

    return constructProposalProcessItem(item, proposalDetail.symbolPrice);
  });
}

const ProposalDetail = () => {
  useChainRoute();

  const { proposalIndex } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchProposalDetail(chain, proposalIndex));
    return () => {
      dispatch(setProposalDetail({}));
    };
  }, [dispatch, chain, proposalIndex]);

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
        <InformationTable loading={loadingProposalDetail} />
        <ProposalLifeCycleTable loading={loadingProposalDetail} />
        <RelatedLinks type="proposal" index={parseInt(proposalIndex)} />
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
