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
import { hexToString } from "@polkadot/util";

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

function mergeExtrinsicsAndMotions(extrinsics, motions) {
  const result = [...extrinsics.filter(item => item.extrinsic), ...motions];
  const indexer = (item) => (item.extrinsic || item.timeline?.[0].extrinsic)?.extrinsicIndexer;
  result.sort((a, b) => indexer(a)?.blockHeight - indexer(b)?.blockHeight)
  return result;
}

function processTimeline(bountyDetail) {
  return mergeExtrinsicsAndMotions(bountyDetail.timeline || [], bountyDetail.motions || []).map(item =>
    item.timeline ? (motion => ({
      index: motion.index,
      polkassembly: polkassemblyApi.getMotionUrl(motion.index),
      defaultUnfold: !motion.result,
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
    }))(item) : (extrinsic => {
      let fields = [];

      if (extrinsic.name === "proposeBounty") {
        const proposer = extrinsic.signer;
        const { value, description } = extrinsic.args;
        const title = hexToString(description);
        fields = [
          {
            title: "Proposer",
            value: <User address={proposer} />,
          },
          {
            title: "Value",
            value: <Balance value={value} />,
          },
          {
            title: "Title",
            value: title,
          },
        ];
      } else if (extrinsic.name === "acceptCurator") {
        const curator = extrinsic.signer;
        fields = [
          {
            title: "Curator",
            value: <User address={curator} />,
          },
        ];
      } else if (extrinsic.name === "awardBounty") {
        const curator = extrinsic.signer;
        const { beneficiary } = extrinsic.args;
        fields = [
          {
            title: "Curator",
            value: <User address={curator} />,
          }, {
            title: "Beneficiary",
            value: <User address={beneficiary} />,
          },
        ];
      }

      return {
        extrinsicIndexer: extrinsic.extrinsicIndexer,
        name: extrinsic.name,
        fields,
      };
    })(item.extrinsic)
  )
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
