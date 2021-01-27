import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import {
  bountyDetailSelector,
  fetchBountyDetail,
  loadingBountyDetailSelector,
} from "../../store/reducers/bountySlice";

import InformationTable from "./InformationTable";
import Timeline from "../Timeline";
import Comment from "../Comment";
import RelatedLinks from "../RelatedLinks";
import BountyLifeCycleTable from "./BountyLifeCycleTable";
import User from "../../components/User";
import Balance from "../../components/Balance";
import Voter from "../../components/Voter";
import Proposer from "../../components/Proposer";
import BlocksTime from "../../components/BlocksTime";
import TimelineCommentWrapper from "../../components/TimelineCommentWrapper";
import { hexToString } from "@polkadot/util";
import { stringToWords } from "../../utils";

import { scanHeightSelector } from "../../store/reducers/chainSlice";
import DetailGoBack from "../components/DetailGoBack";

const ValueWrapper = styled.span`
  margin-right: 4px;
  color: #1d253c;
`;
const UnitWrapper = styled.span`
  color: #1d253c;
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
  const result = [...extrinsics.filter((item) => item.extrinsic), ...motions];
  const indexer = (item) =>
    (item.extrinsic || item.timeline?.[0].extrinsic)?.extrinsicIndexer;
  result.sort((a, b) => indexer(a)?.blockHeight - indexer(b)?.blockHeight);
  return result;
}

function processTimeline(bountyDetail, scanHeight) {
  return mergeExtrinsicsAndMotions(
    bountyDetail.timeline || [],
    bountyDetail.motions || []
  ).map((item) =>
    item.timeline
      ? ((motion) => ({
          index: motion.index,
          defaultUnfold: !motion.result,
          subTimeline: (motion.timeline || []).map((item) => ({
            name:
              item.action === "Propose"
                ? `Motion #${motion.index}`
                : item.action,
            extrinsicIndexer: item.extrinsic.extrinsicIndexer,
            fields: (() => {
              if (item.action === "Propose") {
                const [proposer, , , threshold] = item.eventData;
                const ayes = motion.voting?.ayes?.length || 0;
                const nays = motion.voting?.nays?.length || 0;
                const proposalArgs = item.extrinsic?.args?.proposal?.args ?? {};
                const argItems = Object.keys(proposalArgs)
                  .filter((key) => key !== "bounty_id")
                  .map((key) => {
                    const val = proposalArgs[key];
                    return {
                      title: stringToWords(key),
                      value: (() => {
                        if (key === "curator") {
                          return <User address={val} />;
                        } else if (key === "fee") {
                          return <Balance value={val} />;
                        } else {
                          return val;
                        }
                      })(),
                    };
                  });

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
                        value={motion.method}
                        args={argItems}
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
        }))(item)
      : ((extrinsic) => {
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
              },
              {
                title: "Beneficiary",
                value: <User address={beneficiary} />,
              },
            ];
          } else if (extrinsic.name === "extendBountyExpiry") {
            const signer = extrinsic.signer;
            const { _remark } = extrinsic.args;
            fields = [
              {
                title: "Signer",
                value: <User address={signer} />,
              },
              {
                title: "Remark",
                value: hexToString(_remark),
              },
            ];
          }

          return {
            extrinsicIndexer: extrinsic.extrinsicIndexer,
            name: extrinsic.name,
            fields,
          };
        })(item.extrinsic)
  );
}

const BountyDetail = () => {
  const { bountyIndex } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    dispatch(fetchBountyDetail(bountyIndex));
  }, [dispatch, bountyIndex]);

  const loadingBountyDetail = useSelector(loadingBountyDetailSelector);
  const bountyDetail = useSelector(bountyDetailSelector);
  const scanHeight = useSelector(scanHeightSelector);

  useEffect(() => {
    setTimelineData(processTimeline(bountyDetail, scanHeight));
  }, [bountyDetail, scanHeight]);

  return (
    <>
      <DetailGoBack />
      <TableWrapper>
        <InformationTable loading={loadingBountyDetail} />
        <BountyLifeCycleTable loading={loadingBountyDetail} />
      </TableWrapper>
      <RelatedLinks type="bounties" index={parseInt(bountyIndex)} />
      <TimelineCommentWrapper>
        <Timeline data={timelineData} loading={loadingBountyDetail} />
        <Comment type="bounties" index={parseInt(bountyIndex)} />
      </TimelineCommentWrapper>
    </>
  );
};

export default BountyDetail;
