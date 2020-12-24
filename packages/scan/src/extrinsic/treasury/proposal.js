const { saveProposalTimeline } = require("../../store/proposal");
const { ProposalMethods, Modules } = require("../../utils/constants");

async function handleProposalExtrinsic(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  if (section !== Modules.Treasury) {
    return;
  }

  if (!isSuccess) {
    return;
  }

  // Proposal methods
  if (name === ProposalMethods.approveProposal) {
    await handleApproveProposal(args, indexer, events);
  }
}

async function handleApproveProposal(args, indexer, events) {
  const { proposal_id: proposalIndex } = args;

  await saveProposalTimeline(
    proposalIndex,
    ProposalMethods.approveProposal,
    args,
    indexer
  );
}

module.exports = {
  handleProposalExtrinsic,
};
