import React from "react";
import ReferendumVote from "../../../components/ReferendumVote";
import { TYPE_DEMOCRACY_REFERENDUM } from "../../../constants";

export function normalizeReferendumTimelineItem(referendum, scanHeight) {
  return {
    index: referendum.referendumIndex,
    defaultUnfold: referendum.state.state !== "Executed",
    end: referendum.meta?.end,
    subTimeline: (referendum.timeline || []).map((item) => ({
      ...(item.method === "Started"
        ? { referendumIndex: referendum.referendumIndex, type: TYPE_DEMOCRACY_REFERENDUM }
        : {}),
      name:
        item.method === "Started" ? `referenda` : item.method,
      extrinsicIndexer: item.type === "extrinsic" ? item.indexer : undefined,
      eventIndexer: item.type === "event" ? item.indexer : undefined,
      fields: (() => {
        if (item.method === "Started") {
          return [
            {
              value: (
                <ReferendumVote referendum={referendum} />
              ),
            },
          ];
        } else if (item.method === "Passed") {
          return [];
        } else if (item.method === "Executed") {
          return [];
        } else {
          return [];
        }
      })(),
    })),
  };
}
