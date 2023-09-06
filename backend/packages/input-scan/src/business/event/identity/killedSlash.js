const { getIdentitySlashCollection } = require("../../../mongo/data");
const {
  consts: {
    Modules,
    IdentityEvents,
  }
} = require("@osn/scan-common");

async function handleIdentityKilledSlash(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 1) {
    return;
  }

  const nextEvent = blockEvents[sort + 1];
  const {
    event: { section, method, data, },
  } = nextEvent;
  if (section !== Modules.Identity || method !== IdentityEvents.IdentityKilled) {
    return;
  }

  const obj = {
    indexer,
    section,
    method,
    killedAccount: data[0].toString(),
    balance: data[1].toString(),
  }

  const col = await getIdentitySlashCollection()
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleIdentityKilledSlash,
}
