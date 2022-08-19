const { handleRenounced } = require("./renounced");
const { handleElectionNewTerm } = require("./newTerm");

async function handleEvents(events = [], extrinsics = [], blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    let indexer = {
      ...blockIndexer,
      eventIndex: sort,
    }

    let extrinsic, extrinsicIndex;
    if (!phase.isNull) {
      extrinsicIndex = phase.value.toNumber();
      indexer = { ...indexer, extrinsicIndex };
      extrinsic = extrinsics[extrinsicIndex];
    }

    await handleElectionNewTerm(event, indexer, extrinsic);
    await handleRenounced(event, indexer);
  }
}

module.exports = {
  handleEvents,
};
