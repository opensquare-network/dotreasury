const { Modules, ProposalEvents } = require("../../../utils/constants");
const { handleProposed } = require("./proposed");
const { handleRejected } = require("./rejected");
const { handleAwarded } = require("./awarded");

async function handleProposalEvent(
  event,
  blockIndexer,
  nullableNormalizedExtrinsic,
  eventSort
) {
  const { section, method } = event;
  if (Modules.Treasury !== section || !ProposalEvents.hasOwnProperty(method)) {
    return;
  }

  const eventIndexer = { ...blockIndexer, sort: eventSort };

  if (method === ProposalEvents.Proposed) {
    await handleProposed(event, nullableNormalizedExtrinsic);
  } else if (method === ProposalEvents.Rejected) {
    await handleRejected(event, eventIndexer);
  } else if (method === ProposalEvents.Awarded) {
    await handleAwarded(event, eventIndexer);
  }
}

module.exports = {
  handleProposalEvent,
};
