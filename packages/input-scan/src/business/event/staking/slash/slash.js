const { getStakingSlashCollection } = require("../../../../mongo/data");
const {
  Modules,
  StakingEvents,
} = require("../../../common/constants")

async function handleSlashEvent(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort <= 0) {
    return;
  }

  const preEvent = blockEvents[sort - 1];
  const {
    event: { section, method, },
  } = preEvent;

  if (Modules.Staking !== section || StakingEvents.Slash !== method) {
    return
  }

  const obj = {
    indexer,
    section,
    method,
    balance: event.data[0].toString(),
  }

  const col = await getStakingSlashCollection()
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleSlashEvent,
}
