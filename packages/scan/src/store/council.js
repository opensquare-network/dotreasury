const {
  getProposalCollection,
  getProposalTimelineCollection,
  getTipCollection,
  getTipTimelineCollection,
  getBountyCollection,
  getBountyTimelineCollection,
  getCouncilProposalCollection,
} = require("../mongo");
const { CouncilEvents } = require("../utils/constants");

async function saveNewCouncilProposal(
  proposalHash,
  threshold,
  callInfo,
  indexer
) {
  const councilProposalCol = await getCouncilProposalCollection();
  await councilProposalCol.insertOne({
    proposalHash,
    indexer,
    threshold,
    ...callInfo,
  });
}

async function findCouncilProposal() {
  const councilProposalCol = await getCouncilProposalCollection();
  const councilProposal = await councilProposalCol.findOne({ proposalHash });
  return councilProposal;
}

async function saveTimeline(councilProposalHash, state, data, indexer) {
  const [timelineCol, timelineIndexer] = await findTimeline(
    councilProposalHash
  );

  if (!timelineCol) {
    return;
  }

  await timelineCol.insertOne({
    indexer,
    ...timelineIndexer,
    state,
    data,
  });

  if (state === CouncilEvents.Executed && data.result === true) {
    const councilProposal = await findCouncilProposal(proposalHash);
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
  saveTimeline,
  findCouncilProposal,
  saveNewCouncilProposal,
};
