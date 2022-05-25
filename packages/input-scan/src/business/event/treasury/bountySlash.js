const { getTreasurySlashCollection } = require("../../../mongo/data");
const {
  consts: {
    Modules,
    BountyEvents,
  }
} = require("@osn/scan-common");

async function handleBountySlash(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 1) {
    return;
  }

  const nextEvent = blockEvents[sort + 1];
  const {
    event: { section, method, data },
  } = nextEvent;
  if (
    ![Modules.Treasury, Modules.Bounties].includes(section) ||
    method !== BountyEvents.BountyRejected
  ) {
    return;
  }

  const obj = {
    indexer,
    section,
    method,
    balance: event.data[0].toString(),
    bountyIndex: data[0].toNumber(),
  };

  const col = await getTreasurySlashCollection();
  await col.insertOne(obj);

  return obj;
}

module.exports = {
  handleBountySlash,
}
