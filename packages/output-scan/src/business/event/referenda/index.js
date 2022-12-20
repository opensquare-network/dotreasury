const {
  consts: {
    Modules,
    ReferendumEvents,
    CHAINS,
  },
  env: { currentChain },
} = require("@osn/scan-common")

const moduleName = "Referenda";

async function handleReferendaEvent(event, indexer, extrinsic, blockEvents) {
  const { section, method } = event;
  if (moduleName !== section) {
    return
  }

  // todo: handle various methods
}

module.exports = {
  handleReferendaEvent,
}
