const { getFellowshipReferendaSlashCol } = require("../../../mongo/data");
const { findKilledReferendumIndex } = require("./common");

async function handleFellowshipReferendaSlash(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 1) {
    return;
  }

  const nextEvent = blockEvents[sort + 1];
  const { event: { section, method } } = nextEvent;
  if (section !== "fellowshipReferenda" || method !== "DepositSlashed") {
    return;
  }

  const obj = {
    indexer,
    section,
    method,
    balance: event.data[0].toString(),
    killedReferendum: findKilledReferendumIndex(sort, blockEvents, "fellowshipReferenda"),
  }

  const col = await getFellowshipReferendaSlashCol();
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleFellowshipReferendaSlash,
}
