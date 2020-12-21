const { isTipEvent, handleTipEvent } = require("./tip");
const { isBountyEvent, handleBountyEvent } = require("./bounty");
const { isProposalEvent, handleProposalEvent } = require("./proposal");

async function handleTreasuryEvent(event, indexer, eventSort) {
  const { method, data } = event;
  const jsonData = data.toJSON();

  if (isTipEvent(method)) {
    await handleTipEvent(method, jsonData, indexer, eventSort);
  } else if (isBountyEvent(method)) {
    await handleBountyEvent(method, jsonData, indexer, eventSort);
  } else if (isProposalEvent(method)) {
    await handleProposalEvent(method, jsonData, indexer, eventSort);
  }
}

module.exports = {
  handleTreasuryEvent,
};
