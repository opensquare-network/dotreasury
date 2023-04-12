import React, { useEffect, useState } from "react";
import ReferendumVote from "../../../components/ReferendumVote";
import { TimelineItemType } from "../../../constants";
import useApi from "../../../hooks/useApi";
import { getElectorate, getReferendumInfo } from "../../../services/chainApi";
import { useIsMounted } from "@osn/common";
import LoadingItem from "../../Timeline/LoadingItem";
import Item from "../../Timeline/Item";

function ReferendumSubTimeline({ referendum, scanHeight }) {
  const [tally, setTally] = useState(referendum?.tally);
  const [electorate, setElectorate] = useState(referendum?.tally?.electorate);

  // Check if referendum is vote finished
  const isVoteFinish = [
    "Passed",
    "NotPassed",
    "Executed",
    "Canceled",
    "Cancelled",
  ].includes(referendum?.state?.state);
  const [isTallyLoading, setIsTallyLoading] = useState(!isVoteFinish);
  const [isElectorateLoading, setIsElectorateLoading] = useState(!isVoteFinish);

  const isMounted = useIsMounted();
  const api = useApi();

  // Load on-chain tally data
  useEffect(() => {
    if (isVoteFinish || !api) {
      return;
    }
    setIsTallyLoading(true);
    getReferendumInfo(api, referendum?.referendumIndex)
      .then((referendumInfo) => {
        if (isMounted.current) {
          setTally(referendumInfo?.ongoing?.tally);
        }
      }).finally(() => {
        setIsTallyLoading(false);
      });
  }, [api, referendum, isVoteFinish, isMounted]);

  // Load on-chain electorate
  useEffect(() => {
    if (isVoteFinish || !api) {
      return;
    }
    setIsElectorateLoading(true);
    getElectorate(api).then(electorate => {
      if (isMounted.current) {
        setElectorate(electorate);
      }
    }).finally(() => {
      setIsElectorateLoading(false);
    });
  }, [api, referendum, isVoteFinish, isMounted]);

  const polkasemblyId = referendum?.referendumIndex;

  if (!isVoteFinish && (isTallyLoading || isElectorateLoading)) {
    // When referendum vote is not finish, show loading timeline item and fetch data from block chain
    const data = createSubTimelineItem(
      referendum,
      referendum.timeline[0],
      tally,
      electorate
    );

    return (
      <LoadingItem
        data={data}
        polkassembly={polkasemblyId}
      />
    );
  } else {
    return (referendum.timeline || []).map(
      (item) => createSubTimelineItem(referendum, item, tally, electorate)
    ).map((item, index) => (
      <Item
        key={index}
        data={item}
        polkassembly={index === 0 ? polkasemblyId : undefined}
      />
    ));
  }
}

function createSubTimelineItem(referendum, item, tally, electorate) {
  const result = {};

  if (item.method === "Started") {
    result.referendumIndex = referendum.referendumIndex;
    result.type = TimelineItemType.DemocracyReferendum;
    result.name = "Referendum";
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
          <ReferendumVote
            tally={tally}
            electorate={electorate}
            threshold={referendum?.meta?.threshold}
          />
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

export function normalizeReferendumTimelineItem(referendum, scanHeight) {
  return {
    index: referendum.referendumIndex,
    defaultUnfold: referendum.state.state !== "Executed",
    end: referendum.meta?.end,
    subTimeline: <ReferendumSubTimeline referendum={referendum} scanHeight={scanHeight} />,
  };
}
