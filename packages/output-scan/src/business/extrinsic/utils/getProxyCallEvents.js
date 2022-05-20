const { WrappedEvents } = require("../../../utils/wrappedEvents");
const { ProxyEvents } = require("../../common/constants");

function getProxyInnerCallEvents(wrappedEvents) {
  const source = (wrappedEvents?.events || []);
  const index = source.findIndex(
    ({ event }) => event?.method === ProxyEvents.ProxyExecuted
  )

  let events = source.slice(0, index);
  if (index < 0) {
    events = source;
  }

  return new WrappedEvents(
    events,
    wrappedEvents.offset,
    index >= 0 ? true : wrappedEvents.wrapped
  );
}

module.exports = {
  getProxyInnerCallEvents,
}
