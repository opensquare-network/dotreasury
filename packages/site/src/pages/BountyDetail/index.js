import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import { Image } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import {
  fetchBountyDetail,
  bountyDetailSelector,
  loadingBountyDetailSelector,
} from "../../store/reducers/bountySlice";

import InformationTable from "./InformationTable";
import Timeline from "../Timeline";
import Comment from "../Comment";
import RelatedLinks from "../RelatedLinks";
import Title from "../../components/Title";
import BountyLifeCycleTable from "./BountyLifeCycleTable";
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

function processTimeline(bountyDetail) {
  return [{
    name: "Proposed",
    extrinsicIndexer: bountyDetail.indexer || {},
    fields: [{
      title: "Proposer",
      value: <User address={bountyDetail.proposer} />
    }, {
      title: "Beneficiary",
      value: bountyDetail.beneficiary ? <User address={bountyDetail.beneficiary} /> : "--"
    }, {
      title: "Value",
      value: <Balance value={bountyDetail.value} />
    }]
  },
  ...(bountyDetail.motions || []).map(motion => ({
      polkassembly: polkassemblyApi.getMotionUrl(motion.index),
      subTimeline: (motion.timeline || []).map(item => ({
        name: (item.action === "Propose" ? `Motion #${motion.index}` : item.action),
        extrinsicIndexer: item.extrinsic.extrinsicIndexer,
        fields: (() => {
          if (item.action === "Propose") {
            const [proposer, , , threshold] = item.eventData;
            const ayes = motion.voting?.ayes?.length || 0;
            return [{
              value: <Proposer address={proposer} agree={motion.result && motion.result === "Approved"} value={motion.method} threshold={threshold} ayes={ayes} />
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
    ...(bountyDetail.latestState?.state === "Awarded" ? [{
      name: "Awarded",
      eventIndexer: bountyDetail.latestState?.indexer || {},
      fields: [{
        title: "Beneficiary",
        value: <User address={bountyDetail.latestState?.data[2]} />
      }, {
        title: "Balance",
        value: <Balance value={bountyDetail.latestState?.data[1]} />
      }]
    }] : [])
  ]
}

const BountyDetail = () => {
  const history = useHistory();
  const { bountyIndex } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBountyDetail(bountyIndex));
  }, [dispatch, bountyIndex]);

  const loadingBountyDetail = useSelector(loadingBountyDetailSelector);
  const bountyDetail = useSelector(bountyDetailSelector);

  return (
    <>
      <HeaderWrapper>
        <div onClick={() => history.goBack()}>
          <Image src="/imgs/left-arrow.svg" width={"32px"} height={"32px"} />
        </div>
        <Title>Detail</Title>
      </HeaderWrapper>
      <TableWrapper>
        <InformationTable loading={loadingBountyDetail} />
        <BountyLifeCycleTable loading={loadingBountyDetail} />
      </TableWrapper>
      <RelatedLinks type="bounties" index={bountyIndex} />
      <TimelineCommentWrapper>
        <Timeline
          data={processTimeline(bountyDetail)}
          loading={loadingBountyDetail}
        />
        <Comment />
      </TimelineCommentWrapper>
    </>
  );
};

export default BountyDetail;
