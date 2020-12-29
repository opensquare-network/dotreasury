const { handleTreasuryEvent } = require("./treasury");

async function extractEventBusinessData(
  event,
  extrinsic,
  blockIndexer,
  eventSort
) {
  await handleTreasuryEvent(
    event,
    extrinsic,
    blockIndexer,
    eventSort
  );
  // await handleCouncilEvent(event, indexer, eventSort);
}

module.exports = {
  extractEventBusinessData,
};
