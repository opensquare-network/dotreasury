const { retrieveCouncilProposalHash } = require("./utils");
const {
  getCouncilProposalCollection,
  getProposalCollection,
  getProposalTimelineCollection,
} = require("../../mongo");

async function handleCouncilProposeApproveProposal(
  callInfo,
  threshold,
  indexer,
  events
) {
  if (callInfo.module !== "treasury") {
    return;
  }

  if (callInfo.method !== "approveProposal") {
    return;
  }

  const proposalHash = retrieveCouncilProposalHash(events);

  if (!proposalHash) {
    return;
  }

  const { proposal_id: proposalIndex } = callInfo.args;

  const councilProposalCol = await getCouncilProposalCollection();
  await councilProposalCol.insertOne({
    proposalHash,
    indexer,
    threshold,
    ...callInfo,
  });

  const proposalCol = await getProposalCollection();
  await proposalCol.updateOne(
    {
      proposalIndex,
    },
    {
      $push: {
        councilProposals: {
          indexer,
          proposalHash,
        },
      },
    }
  );

  const proposalTimelineCol = await getProposalTimelineCollection();
  await proposalTimelineCol.insertOne({
    indexer,
    proposalIndex,
    state: "CouncilProposed",
    data: {
      proposalHash,
      threshold,
      ...callInfo,
    },
  });
}

module.exports = {
  handleCouncilProposeApproveProposal,
};
