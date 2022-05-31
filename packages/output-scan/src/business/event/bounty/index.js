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
    await handleBountyAwarded(...arguments);
  } else if (BountyEvents.BountyRejected === method) {
    await handleBountyRejected(...arguments);
  } else if (BountyEvents.BountyClaimed === method) {
    await handleBountyClaimed(...arguments);
  } else if (BountyEvents.BountyCanceled === method) {
    await handleBountyCanceled(...arguments);
  } else if (BountyEvents.BountyExtended === method) {
    await handleBountyExtended(...arguments);
  }
}

async function handleBountyEventWithoutExtrinsic(event, indexer) {
  const { section, method } = event;
  if (
    [Modules.Treasury, Modules.Bounties].includes(section) &&
    method === BountyEvents.BountyBecameActive
  ) {
    await handleBountyBecameActiveEvent(event, indexer);
  }
}

module.exports = {
  handleBountyEventWithExtrinsic,
  handleBountyEventWithoutExtrinsic,
}
