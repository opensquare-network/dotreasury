const {
  getProposalCollection,
  getProposalTimelineCollection,
  getTipCollection,
  getTipTimelineCollection,
  getBountyCollection,
  getBountyTimelineCollection,
  getCouncilProposalCollection,
} = require("../../mongo");

async function handleCouncilEvent(event, indexer, eventSort) {
  const { method, data } = event;
  const jsonData = data.toJSON();

  await handleVoteEvent(method, jsonData, indexer, eventSort);
  await handleApprovedEvent(method, jsonData, indexer, eventSort);
  await handleDisapprovedEvent(method, jsonData, indexer, eventSort);
  await handleExecutedEvent(method, jsonData, indexer, eventSort);
}

async function handleVoteEvent(method, jsonData, indexer, eventSort) {
  if (method !== "Voted") {
    return;
  }

  const [account, proposalHash, voted, yes, no] = jsonData;

  const [timelineCol, timelineIndexer] = await findTimeline(proposalHash);

  if (!timelineCol) {
    return;
  }

  await timelineCol.insertOne({
    indexer,
    ...timelineIndexer,
    state: "CouncilVoted",
    data: {
      account,
      proposalHash,
      voted,
      yes,
      no,
    },
  });
}

async function handleApprovedEvent(method, jsonData, indexer, eventSort) {
  if (method !== "Approved") {
    return;
  }

  const [proposalHash] = jsonData;

  const [timelineCol, timelineIndexer] = await findTimeline(proposalHash);

  if (!timelineCol) {
    return;
  }

  await timelineCol.insertOne({
    indexer,
    ...timelineIndexer,
    state: "CouncilApproved",
    data: {
      proposalHash,
    },
  });
}

async function handleDisapprovedEvent(method, jsonData, indexer, eventSort) {
  if (method !== "Disapproved") {
    return;
  }

  const [proposalHash] = jsonData;

  const [timelineCol, timelineIndexer] = await findTimeline(proposalHash);

  if (!timelineCol) {
    return;
  }

  await timelineCol.insertOne({
    indexer,
    ...timelineIndexer,
    state: "CouncilDisapproved",
    data: {
      proposalHash,
    },
  });
}

async function handleExecutedEvent(method, jsonData, indexer, eventSort) {
  if (method !== "Executed") {
    return;
  }

  const [proposalHash, result] = jsonData;

  const [timelineCol, timelineIndexer] = await findTimeline(proposalHash);

  if (!timelineCol) {
    return;
  }

  await timelineCol.insertOne({
    indexer,
    ...timelineIndexer,
    state: "CouncilExecuted",
    data: {
      proposalHash,
      result,
    },
  });

  // The council proposal was executed successfully, update timeline state
  if (result) {
    const councilProposalCol = await getCouncilProposalCollection();
    const councilProposal = await councilProposalCol.findOne({ proposalHash });
    if (councilProposal) {
      await timelineCol.insertOne({
        indexer,
        ...timelineIndexer,
        state: councilProposal.method,
        data: councilProposal,
      });
    }
  }
}

async function findTimeline(councilProposalHash) {
  let indexer = null;
  let col = null;

  col = await getProposalCollection();
  const rawProposal = await col.findOne({
    "councilProposals.proposalHash": councilProposalHash,
  });
  if (rawProposal) {
    col = await getProposalTimelineCollection();
    indexer = { proposalIndex: rawProposal.proposalIndex };
  }

  if (!indexer) {
    col = await getBountyCollection();
    const rawBounty = await col.findOne({
      "councilProposals.proposalHash": councilProposalHash,
    });
    if (rawBounty) {
      col = await getBountyTimelineCollection();
      indexer = { bountyIndex: rawProposal.bountyIndex };
    }
  }

  if (!indexer) {
    col = await getTipCollection();
    const rawTip = await col.findOne({
      "councilProposals.proposalHash": councilProposalHash,
    });
    if (rawTip) {
      col = await getTipTimelineCollection();
      indexer = { hash: rawProposal.hash };
    }
  }

  if (!indexer) {
    return [null, null];
  }

  return [col, indexer];
}

module.exports = {
  handleCouncilEvent,
};
