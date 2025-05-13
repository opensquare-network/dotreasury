const { handleCommonEvents, handleEventWithoutExtrinsic } = require("../../business/event");

async function handleNonExtrinsicEvents(blockEvents = [], blockIndexer) {
  const systemEvents = blockEvents.filter(e => e.phase.isNone);
  for (let sort = 0; sort < systemEvents.length; sort++) {
    const { event } = systemEvents[sort];
    let indexer = { ...blockIndexer, eventIndex: sort };

    await handleCommonEvents(event, indexer, null, blockEvents);
    await handleEventWithoutExtrinsic(blockIndexer, event, blockEvents);
  }
}

module.exports = {
  handleNonExtrinsicEvents,
}
