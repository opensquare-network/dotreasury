const { getElectionSlashCollection } = require("../../../mongo/data");
const {
  Modules,
  ElectionsPhragmenEvents,
} = require("../../common/constants")

async function handleSeatHolderSlash(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 1) {
    return;
  }

  const nextEvent = blockEvents[sort + 1];
  const {
    event: { section, method, },
  } = nextEvent;
  if (![Modules.ElectionsPhragmen, Modules.PhragmenElection].includes(section) ||
    method !== ElectionsPhragmenEvents.SeatHolderSlashed) {
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
  handleSeatHolderSlash,
}
