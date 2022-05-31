const { handleAcceptCurator } = require("./bounty/acceptCurator");
const { handleCloseTipCall } = require("./tip/close");
const { handleTipCall } = require("./tip/tip");
const {
  utils: { extractExtrinsicEvents, isExtrinsicSuccess }
} = require("@osn/scan-common")
const { handleProposeCurator } = require("./child-bounties/propose-curator")
const { handleAcceptCurator: handleAcceptChildBountyCurator } = require("./child-bounties/accept-curator")
const { handleUnassignChildBountyCurator } = require("./child-bounties/unassign-curator");
const { handleCallsInExtrinsic } = require("@osn/scan-common")

async function handleCall(call, author, extrinsicIndexer, wrappedEvents) {
  await handleTipCall(...arguments);
  await handleCloseTipCall(...arguments);
  await handleAcceptCurator(...arguments);
  await handleProposeCurator(...arguments);
  await handleAcceptChildBountyCurator(...arguments);
  await handleUnassignChildBountyCurator(...arguments);
}

async function handleExtrinsics(extrinsics = [], allEvents = [], blockIndexer) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);
    if (!isExtrinsicSuccess(events)) {
      continue;
    }

    const extrinsicIndexer = { ...blockIndexer, extrinsicIndex: index++ };
    await handleCallsInExtrinsic(extrinsic, events, extrinsicIndexer, handleCall)
  }
}

module.exports = {
  handleExtrinsics,
};
