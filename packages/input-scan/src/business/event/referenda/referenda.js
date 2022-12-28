const { findKilledReferendumIndex } = require("./common");
const { getReferendaSlashCol } = require("../../../mongo/data");

async function handleReferendaSlash(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 1) {
    return;
  }

  const nextEvent = blockEvents[sort + 1];
  const { event: { section, method } } = nextEvent;
  if (section !== "referenda" || method !== "DepositSlashed") {
    return;
  }

  const obj = {
    indexer,
    section,
    method,
    balance: event.data[0].toString(),
    killedReferendum: findKilledReferendumIndex(sort, blockEvents, "referenda"),
  }

  const col = await getReferendaSlashCol();
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleReferendaSlash,
}
