const { handleTreasuryEvent } = require("./treasury");
const { handleCouncilEvent } = require("./council");

async function extractEventBusinessData(event, indexer, eventSort) {
  await handleTreasuryEvent(event, indexer, eventSort);
  await handleCouncilEvent(event, indexer, eventSort);
}

module.exports = {
  extractEventBusinessData,
};
