const { handleTreasuryEvent } = require("./treasury");
const { handleCouncilEvent } = require("./council");

async function extractEventBusinessData(event, indexer, eventSort) {
  const { section } = event;

  if ("treasury" === section) {
    await handleTreasuryEvent(event, indexer, eventSort);
  } else if ("council" === section) {
    await handleCouncilEvent(event, indexer, eventSort);
  }
}

module.exports = {
  extractEventBusinessData,
};
