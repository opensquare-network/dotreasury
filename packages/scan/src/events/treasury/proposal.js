const { ProposalEvents } = require("../../utils/constants");
const {
  saveNewProposal,
  saveProposalTimeline,
} = require("../../store/proposal");

function isProposalEvent(method) {
  return ProposalEvents.hasOwnProperty(method);
}

const isStateChange = isProposalEvent;

async function handleProposalEvent(method, jsonData, indexer, sort) {
  if (!isProposalEvent(method)) {
    return;
  }

  if (method === ProposalEvents.Proposed) {
    const [proposalIndex] = jsonData;
    await saveNewProposal(proposalIndex, indexer);
  }

  if (isStateChange(method)) {
    const proposalIndex = jsonData[0];
    const state = method;
    await saveProposalTimeline(proposalIndex, state, jsonData, indexer, sort);
  }
}

module.exports = {
  handleProposalEvent,
};
