const { handleTreasuryEvent } = require("./treasury");

async function extractEventBusinessData(
  event,
  extrinsic,
  blockIndexer,
  extrinsicIndexer,
  eventSort
) {
  await handleTreasuryEvent(
    event,
    extrinsic,
    blockIndexer,
    extrinsicIndexer,
    eventSort
  );
  // await handleCouncilEvent(event, indexer, eventSort);
}

module.exports = {
  extractEventBusinessData,
};
