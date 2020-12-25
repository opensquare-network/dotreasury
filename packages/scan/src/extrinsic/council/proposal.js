const { retrieveCouncilProposalHash } = require("./utils");
const { ProposalMethods, Modules } = require("../../utils/constants");
const { saveNewCouncilProposal } = require("../../store/council");
const {
  connectCouncilProposal,
  saveProposalTimeline,
} = require("../../store/proposal");

async function handleCouncilProposeApproveProposal(
  callInfo,
  threshold,
  indexer,
  events
) {
  if (callInfo.module !== Modules.Treasury) {
    return;
  }

  if (callInfo.method !== ProposalMethods.approveProposal) {
    return;
  }

  const proposalHash = retrieveCouncilProposalHash(events);

  if (!proposalHash) {
    return;
  }

  await saveNewCouncilProposal(proposalHash, threshold, callInfo, indexer);

  const { proposal_id: proposalIndex } = callInfo.args;

  await connectCouncilProposal(proposalIndex, proposalHash, indexer);
  await saveProposalTimeline(
    proposalIndex,
    "CouncilProposed",
    {
      proposalHash,
      threshold,
      ...callInfo,
    },
    indexer
  );
}

module.exports = {
  handleCouncilProposeApproveProposal,
};
