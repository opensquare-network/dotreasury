function findScheduled(event, indexer, blockEvents) {
  const referendumIndex = event.data[0].toNumber();
  if (indexer.eventIndex <= 0) {
    throw new Error(`Can not find scheduled info at ${ indexer.blockHeight } for referendum ${ referendumIndex }`);
  }

  let maybeScheduledEvent = blockEvents[indexer.eventIndex - 1].event;
  if (
    "preimage" === maybeScheduledEvent.section &&
    "Requested" === maybeScheduledEvent.method &&
    indexer.eventIndex >= 2
  ) {
    maybeScheduledEvent = blockEvents[indexer.eventIndex - 2].event
  }

  const { section, method } = maybeScheduledEvent;
  if ("scheduler" !== section || "Scheduled" !== method) {
    throw new Error(`Can not find scheduled info at ${ indexer.blockHeight } for referendum ${ referendumIndex }`);
  }

  return {
    when: maybeScheduledEvent.data[0].toNumber(),
    index: maybeScheduledEvent.data[1].toNumber(),
  }
}

module.exports = {
  findScheduled,
}
