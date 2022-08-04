const { handleStarted } = require("./started");
const {
  consts: {
    Modules,
    ReferendumEvents,
    CHAINS,
  },
  env: { currentChain },
} = require("@osn/scan-common")

function reachTheLowestHandleHeight(height) {
  const chain = currentChain();
  if (CHAINS.POLKADOT === chain && height >= 10483200) {
    return true
  }

  return CHAINS.KUSAMA === chain && height >= 12651755;
}

function isReferendumEvent(section, method) {
  if (![Modules.Democracy].includes(section)) {
    return false;
  }

  return ReferendumEvents.hasOwnProperty(method);
}

async function handleReferendumEvent(event, indexer, blockEvents) {
  if (!reachTheLowestHandleHeight(indexer.blockHeight)) {
    return
  }

  const { section, method } = event;
  if (!isReferendumEvent(section, method)) {
    return;
  }

  if (ReferendumEvents.Started === method) {
    await handleStarted(...arguments);
  }
}

module.exports = {
  handleReferendumEvent,
}
