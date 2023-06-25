const { handlePreimageNoted } = require("./noted");
const {
  busLogger,
} = require("@osn/scan-common");

async function handlePreimageEventCore(event, indexer) {
  const { section, method } = event;
  if ("preimage" !== section) {
    return
  }

  if ("Noted" === method) {
    await handlePreimageNoted(event, indexer);
  }
}

async function handlePreimageEvent(event, indexer, extrinsic, blockEvents) {
  try {
    await handlePreimageEventCore(event, indexer, extrinsic, blockEvents);
  } catch (e) {
    busLogger.error(`Error happened at ${ indexer.blockHeight }`, e);
  }
}

module.exports = {
  handlePreimageEvent,
}
