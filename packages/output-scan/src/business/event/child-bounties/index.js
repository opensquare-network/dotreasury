const {
  Modules,
  ChildBountiesEvents,
} = require("../../common/constants");

function isTargetEvent(section) {
  return section === Modules.ChildBounties;
}

async function handleChildBountiesEvents(event, indexer, extrinsic) {
  const { section, method } = event;
  if (!isTargetEvent(section)) {
    return
  }

  if (ChildBountiesEvents.Added === method) {
  } else if (ChildBountiesEvents.Awarded === method) {
  } else if (ChildBountiesEvents.Claimed === method) {
  }
}

module.exports = {
  handleChildBountiesEvents,
}
