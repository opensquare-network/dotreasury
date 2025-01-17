const { handleCommonEvents, handleEventWithExtrinsic } = require("../../business/event");

function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter((event) => {
    const { phase } = event;
    return !phase.isNone && phase.value.toJSON() === extrinsicIndex;
  });
}

function extractExtrinsicEventsAndStartIndex(blockEvents, extrinsicIndex) {
  const events = extractExtrinsicEvents(blockEvents, extrinsicIndex);
  const startIndex = blockEvents.findIndex((event) => {
    const { phase } = event;
    return !phase.isNone && phase.value.toJSON() === extrinsicIndex;
  });

  return { events, startIndex };
}

async function handleExtrinsicEventsAndCalls(extrinsics = [], blockEvents = [], blockIndexer) {
  for (let extrinsicIndex = 0; extrinsicIndex < extrinsics.length; extrinsicIndex++) {
    const extrinsic = extrinsics[extrinsicIndex];
    const extrinsicIndexer = { ...blockIndexer, extrinsicIndex };

    const { events, startIndex } = extractExtrinsicEventsAndStartIndex(blockEvents, extrinsicIndex);
    for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
      const { event } = events[eventIndex];
      const indexer = { ...extrinsicIndexer, eventIndex: eventIndex + startIndex };

      await handleCommonEvents(event, indexer, extrinsic, blockEvents);
      await handleEventWithExtrinsic(indexer, event, extrinsic, events);
    }
  }
}

module.exports = {
  handleExtrinsicEventsAndCalls,
}
