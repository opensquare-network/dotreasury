const { getElectionSlashCollection } = require("../../../mongo/data");
const {
  Modules,
  ElectionsPhragmenEvents,
  TreasuryCommonEvent,
} = require("../../common/constants")

function nextDifferentIsNewTerm(allBlockEvents, sort) {
  let i = sort + 1;
  while (i < allBlockEvents.length) {
    const { event: { section, method }, } = allBlockEvents[i];

    const isDeposit = Modules.Treasury === section && TreasuryCommonEvent.Deposit === method;
    const isNewTerm = [Modules.ElectionsPhragmen, Modules.PhragmenElection].includes(section) &&
      method === ElectionsPhragmenEvents.NewTerm;

    if (isDeposit) {
      i++;
      continue;
    }

    return isNewTerm;
  }

  return false;
}

async function handleNewTerm(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort >= blockEvents.length - 1) {
    return;
  }

  if (!nextDifferentIsNewTerm(blockEvents, sort)) {
    return;
  }

  const obj = {
    indexer,
    section: Modules.ElectionsPhragmen,
    method: ElectionsPhragmenEvents.NewTerm,
    balance: event.data[0].toString(),
  }

  const col = await getElectionSlashCollection();
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleNewTerm,
}
