const { handleTipEvent } = require("./tip");
const { handleBountyEvent } = require("./bounty");
const { handleProposalEvent } = require("./proposal");

async function handleTreasuryEvent(event, indexer, eventSort) {
  const { method, data } = event;
  const jsonData = data.toJSON();

  await handleTipEvent(method, jsonData, indexer, eventSort);
  await handleBountyEvent(method, jsonData, indexer, eventSort);
  await handleProposalEvent(method, jsonData, indexer, eventSort);
}

module.exports = {
  handleTreasuryEvent,
};
