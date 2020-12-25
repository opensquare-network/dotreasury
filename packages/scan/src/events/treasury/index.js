const { Modules } = require("../../utils/constants");
const { handleTipEvent } = require("./tip");
const { handleBountyEvent } = require("./bounty");
const { handleProposalEvent } = require("./proposal");

async function handleTreasuryEvent(event, indexer, eventSort) {
  const { section, method, data } = event;

  if (Modules.Treasury !== section) {
    return;
  }

  const jsonData = data.toJSON();

  await handleTipEvent(method, jsonData, indexer, eventSort);
  await handleBountyEvent(method, jsonData, indexer, eventSort);
  await handleProposalEvent(method, jsonData, indexer, eventSort);
}

module.exports = {
  handleTreasuryEvent,
};
