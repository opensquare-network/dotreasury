const {
  ProposalMethods,
  Modules,
  ksmFirstRejectedEventHeight,
} = require("../../utils/constants");

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
}

// FIXME: reject_proposal is wrapped by motion
async function handleRejectProposal(normalizedExtrinsic) {
  const { section, name, args, extrinsicIndexer } = normalizedExtrinsic;

  if (section !== Modules.Treasury) {
    return;
  }

  const noEventRejectProposal =
    name === ProposalMethods.rejectProposal &&
    extrinsicIndexer.blockHeight < ksmFirstRejectedEventHeight;
}

module.exports = {
  handleProposalExtrinsic,
};
