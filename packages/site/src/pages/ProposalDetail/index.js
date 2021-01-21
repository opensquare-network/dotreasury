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
import {
  scanHeightSelector,
} from "../../store/reducers/chainSlice";

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
import BlocksTime from "../../components/BlocksTime";
import polkassemblyApi from "../../services/polkassembly";
import TimelineCommentWrapper from "../../components/TimelineCommentWrapper";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    margin-right: 16px;
  }
  margin-bottom: 20px;
  div:first-child {
    cursor: pointer;
  }
`;

const ValueWrapper = styled.span`
margin-right: 4px;
color: #1D253C;
`
const UnitWrapper = styled.span`
color: #1D253C;
`

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

function processTimeline(proposalDetail, scanHeight) {
  return [
    {
      name: "Proposed",
      extrinsicIndexer: proposalDetail.indexer || {},
      fields: [
        {
          title: "Proposer",
          value: <User address={proposalDetail.proposer} />,
        },
        {
          title: "Beneficiary",
          value: <User address={proposalDetail.beneficiary} />,
        },
        {
          title: "Value",
          value: <Balance value={proposalDetail.value} />,
        },
      ],
    },
    ...(proposalDetail.motions || []).map((motion) => ({
      index: motion.index,
      polkassembly: polkassemblyApi.getMotionUrl(motion.index),
      defaultUnfold: !motion.result && motion.voting?.end >= scanHeight,
      // FIXME: && motion.treasuryProposalId !== 15
      expired:
        !motion.result &&
        motion.voting?.end < scanHeight &&
        motion.treasuryProposalId !== 15,
      end: motion.voting?.end,
      subTimeline: (motion.timeline || []).map((item) => ({
        name:
          item.action === "Propose" ? `Motion #${motion.index}` : item.action,
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
            if (scanHeight > 0 && !motion.result && motion.voting?.end > scanHeight) {
              const blocks = motion.voting?.end - scanHeight;
              argItems.push({
                title: "Voting end",
                value: <BlocksTime
                  blocks={blocks}
                  ValueWrapper={ValueWrapper}
                  UnitWrapper={UnitWrapper}
                />
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
    })),
    ...(proposalDetail.latestState?.state === "Awarded"
      ? [{
        name: "Awarded",
        eventIndexer: proposalDetail.latestState?.indexer || {},
        fields: [
          {
            title: "Beneficiary",
            value: <User address={proposalDetail.latestState?.data[2]} />,
          },
          {
            title: "Balance",
            value: <Balance value={proposalDetail.latestState?.data[1]} />,
          },
        ],
      }]
      : []),
  ];
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
  const scanHeight = useSelector(scanHeightSelector);

  useEffect(() => {
    setTimelineData(processTimeline(proposalDetail, scanHeight));
  }, [proposalDetail, scanHeight]);

  return (
    <>
      <HeaderWrapper>
        <div onClick={() => history.push("/proposals")}>
          <Image src="/imgs/left-arrow.svg" width={"32px"} height={"32px"} />
        </div>
        <Title>Detail</Title>
      </HeaderWrapper>
      <TableWrapper>
        <InformationTable loading={loadingProposalDetail} />
        <ProposalLifeCycleTable loading={loadingProposalDetail} />
      </TableWrapper>
      <RelatedLinks type="proposals" index={parseInt(proposalIndex)} />
      <TimelineCommentWrapper>
        <Timeline data={timelineData} loading={loadingProposalDetail} />
        <Comment />
      </TimelineCommentWrapper>
    </>
  );
};

export default ProposalDetail;
