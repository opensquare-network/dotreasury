const { handleReferenda } = require("./referenda");

async function handleDispatched(event, indexer, extrinsic, blockEvents) {
  await handleReferenda(event, indexer, extrinsic, blockEvents);
}

module.exports = {
  handleDispatched,
}
