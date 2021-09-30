const { handleAwarded } = require("./awarded");
const { handleRejected } = require("./rejected");
const { saveNewTreasuryProposal } = require("./proposed");
const {
  Modules,
  TreasuryProposalEvents,
} = require("../../common/constants");

function isTreasuryProposalEvent(section, method) {
  if (![Modules.Treasury].includes(section)) {
    return false;
  }

  return TreasuryProposalEvents.hasOwnProperty(method);
}

async function handleTreasuryProposalEvent(event, extrinsic, indexer) {
  const { section, method } = event;
  if (!isTreasuryProposalEvent(section, method)) {
    return;
  }

  if (TreasuryProposalEvents.Proposed === method) {
    await saveNewTreasuryProposal(...arguments);
  } else if (TreasuryProposalEvents.Rejected === method) {
    await handleRejected(event, indexer);
  }
}

async function handleTreasuryProposalEventWithoutExtrinsic(
  event,
  indexer // this indexer don't have extrinsic index
) {
  const { section, method } = event;
  if (!isTreasuryProposalEvent(section, method)) {
    return;
  }

  if (TreasuryProposalEvents.Awarded === method) {
    await handleAwarded(...arguments);
  }
}

module.exports = {
  handleTreasuryProposalEvent,
  handleTreasuryProposalEventWithoutExtrinsic,
};
