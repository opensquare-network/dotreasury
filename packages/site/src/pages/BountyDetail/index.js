import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import {
  setBountyDetail,
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
import { stringToWords } from "../../utils";
import DetailTableWrapper from "../../components/DetailTableWrapper";

import {
  chainSelector,
  chainSymbolSelector,
  scanHeightSelector,
} from "../../store/reducers/chainSlice";
import DetailGoBack from "../components/DetailGoBack";
import { useChainRoute } from "../../utils/hooks";

const ValueWrapper = styled.span`
  margin-right: 4px;
  color: #1d253c;
`;
const UnitWrapper = styled.span`
  color: #1d253c;
`;

function isMotion(timelineItem) {
  return !!timelineItem.voting;
}

function timelineItemHeight(timelineItem) {
  if (isMotion(timelineItem)) {
    return timelineItem.timeline[0].indexer.blockHeight;
  }

  if ("extrinsic" === timelineItem.type) {
    return timelineItem.indexer.blockHeight;
  }

  if ("event" === timelineItem.type) {
    return timelineItem.indexer.blockHeight;
  }

  return null;
}

function mergeExtrinsicsAndMotions(timelineItems, motions) {
  const result = [...timelineItems, ...motions];
  result.sort((a, b) => timelineItemHeight(a) - timelineItemHeight(b));
  return result;
}

function processTimeline(bountyDetail, scanHeight, symbol) {
  return mergeExtrinsicsAndMotions(
    bountyDetail.timeline || [],
    bountyDetail.motions || []
  ).map((item) =>
    item.timeline
      ? ((motion) => ({
          index: motion.index,
          defaultUnfold: !motion.isFinal,
          subTimeline: (motion.timeline || []).map((item) => ({
            name:
              ["Propose", "Proposed"].includes(item.method)
                ? `Motion #${motion.index}`
                : item.method,
            extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
            eventIndexer: item.type === "event" ? item.indexer : undefined,
            fields: (() => {
              if (item.method === "Proposed") {
                const { proposer, threshold } = item.args;
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
                          return <User address={val.id || val} />;
                        } else if (key === "fee") {
                          return <Balance value={val} currency={symbol} />;
                        } else {
                          return val;
                        }
                      })(),
                    };
                  });

                if (
                  scanHeight > 0 &&
                  !motion.isFinal &&
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
                        agree={motion.isFinal && motion.timeline.some(item => item.method === "Approved")}
                        value={motion.motionInfo?.method}
                        args={argItems}
                        threshold={threshold}
                        ayes={ayes}
                        nays={nays}
                      />
                    ),
                  },
                ];
              } else if (item.method === "Voted") {
                const { voter, approve: agree } = item.args;
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
              } else if (item.method === "Closed") {
                return [];
              } else {
                return [];
              }
            })(),
          })),
        }))(item)
      : ((item) => {
          let fields = [];

          if (item.name === "proposeBounty") {
            const { proposer, value, description } = item.args;
            fields = [
              {
                title: "Proposer",
                value: <User address={proposer} />,
              },
              {
                title: "Value",
                value: <Balance value={value} currency={symbol} />,
              },
              {
                title: "Title",
                value: description,
              },
            ];
          } else if (item.name === "acceptCurator") {
            const { caller } = item.args;
            fields = [
              {
                title: "Curator",
                value: <User address={caller} />,
              },
            ];
          } else if (item.name === "BountyAwarded") {
            const { beneficiary } = item.args || {};
            fields = [
              {
                title: "Beneficiary",
                value: <User address={beneficiary} />,
              },
            ];
          } else if (item.name === "BountyExtended") {
            const { caller, remark } = item.args;
            fields = [
              {
                title: "Signer",
                value: <User address={caller} />,
              },
              {
                title: "Remark",
                value: remark,
              },
            ];
          } else if (item.name === "BountyRejected") {
            const { caller, slashed } = item.args;
            fields = [
              {
                title: "Closed by",
                value: <User address={caller} />,
              },
              {
                title: "Proposer slashed",
                value: <Balance value={slashed} currency={symbol} />,
              },
            ];
          } else if (item.name === "BountyClaimed") {
            const [, , claimer] = item.eventData || [];
            fields = [
              {
                title: "Beneficiary",
                value: <User address={claimer} />,
              },
            ];
          }

          return {
            extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
            eventIndexer: item.type === "event" ? item.indexer : undefined,
            name: item.name,
            fields,
          };
        })(item)
  );
}

const BountyDetail = () => {
  useChainRoute();

  const { bountyIndex } = useParams();
  const dispatch = useDispatch();
  const [timelineData, setTimelineData] = useState([]);

  const symbol = useSelector(chainSymbolSelector);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchBountyDetail(chain, bountyIndex));
    return () => {
      dispatch(setBountyDetail({}));
    };
  }, [dispatch, chain, bountyIndex]);

  const loadingBountyDetail = useSelector(loadingBountyDetailSelector);
  const bountyDetail = useSelector(bountyDetailSelector);
  const scanHeight = useSelector(scanHeightSelector);

  useEffect(() => {
    setTimelineData(processTimeline(bountyDetail, scanHeight, symbol));
  }, [bountyDetail, scanHeight, symbol]);

  return (
    <>
      <DetailGoBack />
      <DetailTableWrapper title="Bounty" desc={`#${bountyIndex}`}>
        <InformationTable loading={loadingBountyDetail} />
        <BountyLifeCycleTable loading={loadingBountyDetail} />
        <RelatedLinks type="bounty" index={parseInt(bountyIndex)} />
      </DetailTableWrapper>
      <TimelineCommentWrapper>
        <Timeline data={timelineData} loading={loadingBountyDetail} />
        <Comment type="bounty" index={parseInt(bountyIndex)} />
      </TimelineCommentWrapper>
    </>
  );
};

export default BountyDetail;
