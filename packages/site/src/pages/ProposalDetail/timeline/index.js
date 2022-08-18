import React from "react";
import User from "../../../components/User";
import Balance from "../../../components/Balance";
import { normalizeMotionTimelineItem } from "./motion";
import { normalizeReferendumTimelineItem } from "./referendum";

function isMotion(timelineItem) {
  return !!timelineItem.motionInfo;
}

function isReferendum(timelineItem) {
  return !!timelineItem.referendumInfo;
}

function timelineItemHeight(timelineItem) {
  if (isMotion(timelineItem) || isReferendum(timelineItem)) {
    return timelineItem.timeline[0].indexer.blockHeight;
  }

  if ("extrinsic" === timelineItem.type) {
    return timelineItem.indexer.blockHeight;
  }

  if ("event" === timelineItem.type) {
    return timelineItem.indexer.blockHeight;
  }

  return timelineItem.indexer?.blockHeight;
}

function constructProposalProcessItem(item, proposalDetail) {
  const { proposer, value, beneficiary, symbolPrice } = proposalDetail;
  let fields = [];

  const method = item.name || item.method;

  if (method === "Proposed") {
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
      name: method,
      extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
      eventIndexer: item.type === "event" ? item.indexer : undefined,
      fields,
    };
  }

  if (method === "Rejected") {
    const { value } = item.args;
    return {
      name: method,
      extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
      eventIndexer: item.type === "event" ? item.indexer : undefined,
      fields: [
        {
          title: "Slashed",
          value: <Balance value={value} />,
        },
      ],
    };
  }

  if (method === "Awarded") {
    return {
      name: method,
      extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
      eventIndexer: item.type === "event" ? item.indexer : undefined,
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

export function processTimeline(proposalDetail, scanHeight) {
  const { timeline, motions, referendums } = proposalDetail;
  if (!timeline) {
    return [];
  }

  const allItems = [
    ...timeline,
    ...(motions || []),
    ...(referendums || []),
  ];
  allItems.sort((a, b) => timelineItemHeight(a) - timelineItemHeight(b));

  return allItems.map((item) => {
    if (isMotion(item)) {
      return normalizeMotionTimelineItem(item, scanHeight);
    }

    if (isReferendum(item)) {
      return normalizeReferendumTimelineItem(item, scanHeight);
    }

    return constructProposalProcessItem(item, proposalDetail);
  });
}
