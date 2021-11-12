const { getTreasurySlashCollection } = require("../../../mongo/data");
const {
  Modules,
  TipEvents,
} = require("../../common/constants")

async function handleTipSlash(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 1) {
    return;
  }

  const nextEvent = blockEvents[sort + 1];
  const {
    event: { section, method, data },
  } = nextEvent;
  if (
    ![Modules.Treasury, Modules.Tips].includes(section) ||
    method !== TipEvents.TipSlashed
  ) {
    return;
  }

  const obj = {
    indexer,
    section,
    method,
    balance: event.data[0].toString(),
    bountyIndex: data[0].toJSON(),
  };

  const col = await getTreasurySlashCollection();
  await col.insertOne(obj);

  return obj;
}

module.exports = {
  handleTipSlash,
}
