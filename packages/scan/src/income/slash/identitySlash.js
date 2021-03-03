const { Modules, IdentityEvents } = require("../../utils/constants");
const { identitySlashLogger } = require("../../utils/logger");
const { getIdentitySlashCollection } = require("../../mongo");
const { asyncLocalStorage } = require("./utils");

async function saveSlashRecord(data) {
  const session = asyncLocalStorage.getStore();
  const col = await getIdentitySlashCollection();
  await col.insertOne(data, { session });
}

async function handleIdentitySlash(event, sort, allBlockEvents, blockIndexer) {
  const {
    event: { data: treasuryDepositData },
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1) {
    return;
  }

  const nextEvent = allBlockEvents[sort + 1];
  const {
    event: { section, method },
  } = nextEvent;
  if (
    section !== Modules.Identity ||
    method !== IdentityEvents.IdentityKilled
  ) {
    return;
  }

  const identityKilledEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const data = {
    indexer: blockIndexer,
    eventSort: sort + 1,
    section,
    method,
    balance,
    treasuryDepositEventData,
    identityKilledEventData,
  };
  await saveSlashRecord(data);
  identitySlashLogger.info(blockIndexer.blockHeight, method);
  return data;
}

module.exports = {
  handleIdentitySlash,
};
