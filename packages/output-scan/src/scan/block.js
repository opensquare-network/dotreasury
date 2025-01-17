const { handleBlockJobs } = require("./jobs");
const { tryCreateStatPoint } = require("../stats");
const { updateScanHeight } = require("../mongo/scanHeight");
const { chain: { getBlockIndexer } } = require("@osn/scan-common");
const { clearReferendaDelegationMark } = require("../store/referendaDelegationMark");
const { clearReferendaAlarmAt } = require("../store/referendaAlarm");
const { handleKnownBusiness } = require("./known-business");
const { handleNonExtrinsicEvents } = require("./steps/nonExtrinsicEvents");
const { handleExtrinsicEventsAndCalls } = require("./steps/extrinsic");
const { setHeightBlockEvents, clearHeightBlockEvents } = require("../store");

async function handleBlock({ height, block, events }) {
  const blockIndexer = getBlockIndexer(block);
  setHeightBlockEvents(blockIndexer.blockHeight, events);

  await tryCreateStatPoint(blockIndexer);

  await handleNonExtrinsicEvents(events, blockIndexer);
  await handleExtrinsicEventsAndCalls(block.extrinsics, events, blockIndexer);

  await handleKnownBusiness(blockIndexer);

  await handleBlockJobs(blockIndexer);

  await updateScanHeight(height);
  clearReferendaAlarmAt(blockIndexer.blockHeight);
  clearReferendaDelegationMark(blockIndexer.blockHeight);
  clearHeightBlockEvents(blockIndexer.blockHeight);
}

module.exports = {
  handleBlock,
}
