const {
  Modules,
  ChildBountiesEvents,
} = require("../../common/constants");
const { handleAdded } = require("./added");
const { handleCanceled } = require("./canceled");

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
  } else if (ChildBountiesEvents.Claimed === method) {
  } else if (ChildBountiesEvents.Canceled === method) {
    await handleCanceled(...arguments);
  }
}

module.exports = {
  handleChildBountiesEvents,
}
