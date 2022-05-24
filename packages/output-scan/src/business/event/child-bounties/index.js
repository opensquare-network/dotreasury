const {
  consts: {
    Modules,
    ChildBountiesEvents,
  }
} = require("@osn/scan-common");
const { handleAdded } = require("./added");
const { handleCanceled } = require("./canceled");
const { handleAwarded } = require("./awarded");
const { handleClaimed } = require("./claimed");

function isTargetEvent(section) {
  return section === Modules.ChildBounties;
}

async function handleChildBountiesEvents(event, indexer, extrinsic) {
  const { section, method } = event;
  if (!isTargetEvent(section)) {
    return
  }

  if (ChildBountiesEvents.Added === method) {
    await handleAdded(...arguments);
  } else if (ChildBountiesEvents.Awarded === method) {
    await handleAwarded(...arguments);
  } else if (ChildBountiesEvents.Claimed === method) {
    await handleClaimed(...arguments);
  } else if (ChildBountiesEvents.Canceled === method) {
    await handleCanceled(...arguments);
  }
}

module.exports = {
  handleChildBountiesEvents,
}
