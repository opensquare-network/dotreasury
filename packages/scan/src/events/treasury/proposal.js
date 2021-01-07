const { ProposalEvents } = require("../../utils/constants");
const {
  saveNewProposal,
  updateProposalStateByEvent,
} = require("../../store/proposal");
const { Modules } = require("../../utils/constants");

function isProposalEvent(method) {
  return ProposalEvents.hasOwnProperty(method);
}

async function handleProposalEvent(
  event,
  blockIndexer,
  nullableNormalizedExtrinsic
) {
  const { section, method, data } = event;
  if (Modules.Treasury !== section || !isProposalEvent(method)) {
    return;
  }

  const eventData = data.toJSON();
  const proposalIndex = eventData[0];
  if (method === ProposalEvents.Proposed) {
    await saveNewProposal(proposalIndex, nullableNormalizedExtrinsic);
  } else if (
    [ProposalEvents.Rejected, ProposalEvents.Awarded].includes(method)
  ) {
    await updateProposalStateByEvent(
      event,
      blockIndexer,
      nullableNormalizedExtrinsic
    );
  }
}

module.exports = {
  handleProposalEvent,
};
