const { handleBountyBecameActiveEvent } = require("./becameActive");
const { handleBountyExtended } = require("./extended");
const { handleBountyCanceled } = require("./canceled");
const { handleBountyClaimed } = require("./claimed");
const { handleBountyRejected } = require("./rejected");
const {
  consts: {
    Modules,
    BountyEvents,
  }
} = require("@osn/scan-common")
const { handleProposed, } = require("./proposed");
const { handleBountyAwarded } = require("./awarded")

function isBountyEvent(section, method) {
  return (
    [Modules.Treasury, Modules.Bounties].includes(section) &&
    BountyEvents.hasOwnProperty(method)
  );
}

async function handleBountyEventWithExtrinsic(event, extrinsic, indexer) {
  const { section, method } = event;
  if (!isBountyEvent(section, method)) {
    return;
  }

  if (BountyEvents.BountyProposed === method) {
    await handleProposed(event, extrinsic, indexer);
  } else if (BountyEvents.BountyAwarded === method) {
    await handleBountyAwarded(event, indexer);
  } else if (BountyEvents.BountyRejected === method) {
    await handleBountyRejected(event, indexer, extrinsic);
  } else if (BountyEvents.BountyClaimed === method) {
    await handleBountyClaimed(event, indexer);
  } else if (BountyEvents.BountyCanceled === method) {
    await handleBountyCanceled(event, indexer, extrinsic);
  } else if (BountyEvents.BountyExtended === method) {
    await handleBountyExtended(event, indexer, extrinsic);
  }
}

async function handleBountyEventWithoutExtrinsic(event, indexer) {
  const { section, method } = event;
  if (
    [Modules.Treasury, Modules.Bounties].includes(section) &&
    method === BountyEvents.BountyBecameActive
  ) {
    await handleBountyBecameActiveEvent(event, indexer);
  } else if (BountyEvents.BountyAwarded === method) {
    await handleBountyAwarded(event, indexer);
  } else if (BountyEvents.BountyRejected === method) {
    await handleBountyRejected(event, indexer);
  } else if (BountyEvents.BountyClaimed === method) {
    await handleBountyClaimed(event, indexer);
  } else if (BountyEvents.BountyCanceled === method) {
    await handleBountyCanceled(event, indexer);
  } else if (BountyEvents.BountyExtended === method) {
    await handleBountyExtended(event, indexer);
  }
}

module.exports = {
  handleBountyEventWithExtrinsic,
  handleBountyEventWithoutExtrinsic,
}
