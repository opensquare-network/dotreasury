const { handlePreimageMissing } = require("./preimageMissing");
const { handlePreimageInvalid } = require("./preimageInvalid");
const { handleExecuted } = require("./executed");
const { handleNotPassed } = require("./notPassed");
const { handlePassed } = require("./passed");
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
  } else if (ReferendumEvents.Passed === method) {
    await handlePassed(...arguments);
  } else if (ReferendumEvents.NotPassed === method) {
    await handleNotPassed(...arguments);
  } else if (ReferendumEvents.Executed === method) {
    await handleExecuted(event, indexer);
  } else if (ReferendumEvents.PreimageInvalid === method) {
    await handlePreimageInvalid(event, indexer);
  } else if (ReferendumEvents.PreimageMissing === method) {
    await handlePreimageMissing(event, indexer);
  }
}

module.exports = {
  handleReferendumEvent,
}
