const { getElectionSlashCollection } = require("../../../mongo/data");
const {
  consts: {
    Modules,
    ElectionsPhragmenEvents,
  }
} = require("@osn/scan-common");

async function handleCandidateSlash(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 1) {
    return;
  }

  const nextEvent = blockEvents[sort + 1];
  const {
    event: { section, method, },
  } = nextEvent;
  if (![Modules.ElectionsPhragmen, Modules.PhragmenElection].includes(section) ||
    method !== ElectionsPhragmenEvents.CandidateSlashed) {
    return;
  }

  const obj = {
    indexer,
    section,
    method,
    balance: event.data[0].toString(),
  }

  const col = await getElectionSlashCollection();
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleCandidateSlash,
}
