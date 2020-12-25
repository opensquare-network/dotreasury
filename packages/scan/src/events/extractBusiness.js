const { handleTreasuryEvent } = require("./treasury");
const { handleCouncilEvent } = require("./council");

async function extractEventBusinessData(event, extrinsic, indexer, eventSort) {
  await handleTreasuryEvent(event, extrinsic, indexer, eventSort);
  await handleCouncilEvent(event, indexer, eventSort);
}

module.exports = {
  extractEventBusinessData,
};
