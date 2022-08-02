const {
  consts: {
    Modules,
    ReferendumEvents,
  }
} = require("@osn/scan-common")

function isReferendumEvent(section, method) {
  if (![Modules.Democracy].includes(section)) {
    return false;
  }

  return ReferendumEvents.hasOwnProperty(method);
}

async function handleReferendumEvent(event, indexer, blockEvents) {
  const { section, method } = event;
  if (!isReferendumEvent(section, method)) {
    return;
  }


}
