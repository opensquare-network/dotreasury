const { handleTipEvent } = require("./treasury/tip");

async function extractEventBusinessData(event, extrinsic, blockIndexer) {
  await handleTipEvent(event, extrinsic, blockIndexer);
  // await handleCouncilEvent(event, indexer, eventSort);
}

module.exports = {
  extractEventBusinessData,
};
