import React from "react";
import styled from "styled-components";
import Voter from "../../../components/Voter";
import Proposer from "../../../components/Proposer";
import BlocksTime from "../../../components/BlocksTime";
import { TYPE_COUNCIL_MOTION } from "../../../constants";

const ValueWrapper = styled.span`
  margin-right: 4px;
  color: #1d253c;
`;

const UnitWrapper = styled.span`
  color: #1d253c;
`;

function createProposeField(motion, item, scanHeight) {
  const { proposer, threshold } = item.args;
  let ayes, nays;
  if (motion.voting) {
    ayes = motion.voting?.ayes?.length;
    nays = motion.voting?.nays?.length || 0;
  } else {
    const votes = motion.timeline.filter(
      (item) => item.method === "Voted"
    );
    const map = votes.reduce((result, { args: { voter, approve } }) => {
      result[voter] = approve;
      return result;
    }, {});
    const values = Object.values(map);
    ayes = values.filter((v) => v).length;
    nays = values.length - ayes;
  }

  const argItems = [];
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
          agree={ayes >= threshold}
          args={argItems}
          value={motion.proposal.method}
          threshold={threshold}
          ayes={ayes}
          nays={nays}
        />
      ),
    },
  ];
}

function createVoteField(item) {
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
}

export function normalizeMotionTimelineItem(motion, scanHeight) {
  return {
    index: motion.index,
    defaultUnfold: !motion.isFinal && motion.voting?.end >= scanHeight,
    // FIXME: && motion.treasuryProposalId !== 15
    expired:
      !motion.isFinal &&
      motion.voting?.end < scanHeight &&
      motion.treasuryProposalIndex !== 15,
    end: motion.voting?.end,
    subTimeline: (motion.timeline || []).map((item) => ({
      ...(item.method === "Proposed"
        ? { motionIndex: motion.index, type: TYPE_COUNCIL_MOTION }
        : {}),
      name:
        item.method === "Proposed" ? `Motion #${motion.index}` : item.method,
      extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
      eventIndexer: item.type === "event" ? item.indexer : undefined,
      fields: (() => {
        if (item.method === "Proposed") {
          return createProposeField(motion, item, scanHeight);
        } else if (item.method === "Voted") {
          return createVoteField(item);
        } else if (item.method === "Closed") {
          return [];
        } else {
          return [];
        }
      })(),
    })),
  };
}
