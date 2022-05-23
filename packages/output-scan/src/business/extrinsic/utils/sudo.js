const { WrappedEvents } = require("../../../utils/wrappedEvents");
const { Modules, SudoMethods, SudoEvents, } = require("../../common/constants");

function isSudoOk(events, method) {
  const targetEvent = SudoMethods.sudoAs === method ? SudoEvents.SudoAsDone : SudoEvents.Sudid;

  const event = events.find(({ event }) =>
    event.section === Modules.Sudo && targetEvent === event.method
  );

  if (!event) {
    return false
  }

  const [isOk] = event.event.data.toJSON();
  return isOk
}

function getSudoInnerCallEvents(wrappedEvents, method) {
  const targetEvent = SudoMethods.sudoAs === method ? SudoEvents.SudoAsDone : SudoEvents.Sudid;

  const source = (wrappedEvents?.events || []);
  const index = source.findIndex(({ event }) => event?.method === targetEvent);

  let events = source.slice(0, index);
  if (index < 0) {
    return wrappedEvents;
  }

  return new WrappedEvents(
    events,
    wrappedEvents.offset,
    true
  );
}

module.exports = {
  getSudoInnerCallEvents,
  isSudoOk,
}
