import React from "react";
import ReferendumVote from "../../../components/ReferendumVote";
import { TimelineItemType } from "../../../constants";

function createSubTimelineItem(referendum, item) {
  const result = {};

  if (item.method === "Started") {
    result.referendumIndex = referendum.referendumIndex;
    result.type = TimelineItemType.DemocracyReferendum;
    result.name = `Referenda`;
  } else {
    result.name = item.method;
  }

  if (item.type === "extrinsic") {
    result.extrinsicIndexer = item.indexer;
  } else if (item.type === "event") {
    result.eventIndexer = item.indexer;
  }

  if (item.method === "Started") {
    result.fields = [
      {
        value: (
          <ReferendumVote referendum={referendum} />
        ),
      },
    ];
  } else if (item.method === "Passed") {
    result.fields = [];
  } else if (item.method === "Executed") {
    result.fields = [];
  } else {
    result.fields = [];
  }

  return result;
}

export function normalizeReferendumTimelineItem(referendum) {
  return {
    index: referendum.referendumIndex,
    defaultUnfold: referendum.state.state !== "Executed",
    end: referendum.meta?.end,
    subTimeline: (referendum.timeline || []).map(
      (item) => createSubTimelineItem(referendum, item)
    ),
  };
}
