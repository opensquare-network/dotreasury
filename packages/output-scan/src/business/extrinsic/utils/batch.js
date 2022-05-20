const { Modules, UtilityEvents } = require("../../common/constants");
const { WrappedEvents } = require("../../../utils/wrappedEvents");

function findCompletedIndex(events = []) {
  return events.findIndex(
    ({ event }) => event?.method === UtilityEvents.ItemCompleted && Modules.Utility === event?.section
  )
}

function getBatchInnerCallEvents(wrappedEvents, innerCallIndex) {
  const source = (wrappedEvents?.events || []);
  const index = findCompletedIndex(source);

  if (index < 0) {
    return new WrappedEvents(
      source,
      wrappedEvents.offset,
      false // It means the whole batch call events, not the inner call's
    );
  }

  let filteredEventsCnt = 0;
  let count = innerCallIndex;
  let iterEvents = source;

  while (count > 0) {
    const index = findCompletedIndex(iterEvents);
    iterEvents = iterEvents.slice(index + 1);
    filteredEventsCnt = index + 1;
    count--;
  }

  const lastCompletedEventIndex = findCompletedIndex(iterEvents);
  const callEvents = iterEvents.slice(0, lastCompletedEventIndex);

  return new WrappedEvents(
    callEvents,
    wrappedEvents.offset + filteredEventsCnt,
    true,
  )
}

module.exports = {
  getBatchInnerCallEvents,
}
