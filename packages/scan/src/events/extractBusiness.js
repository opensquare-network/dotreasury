const { handleTreasuryEvent } = require("./treasury");

async function extractEventBusinessData(event, indexer, eventSort) {
  const { section } = event;

  if ("treasury" === section) {
    await handleTreasuryEvent(event, indexer, eventSort);
  }
}

module.exports = {
  extractEventBusinessData,
};
