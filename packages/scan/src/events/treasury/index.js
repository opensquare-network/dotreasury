const { Modules } = require("../../utils/constants");
const { handleTipEvent } = require("./tip");

async function handleTreasuryEvent(
  event,
  extrinsic,
  blockIndexer,
  eventSort
) {
  const { section, method, data } = event;
  if (Modules.Treasury !== section) {
    return;
  }

  const eventData = data.toJSON();

  await handleTipEvent(method, eventData, extrinsic, blockIndexer, eventSort);
  // await handleBountyEvent(method, jsonData, blockIndexer, eventSort);
  // await handleProposalEvent(method, jsonData, blockIndexer, eventSort);
}

module.exports = {
  handleTreasuryEvent,
};
