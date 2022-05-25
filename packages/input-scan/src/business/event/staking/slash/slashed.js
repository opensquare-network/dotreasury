const { getStakingSlashCollection } = require("../../../../mongo/data");
const {
  consts: {
    Modules,
    StakingEvents,
    BalancesEvents,
  }
} = require("@osn/scan-common");

function isSlashedEvent(section, method) {
  return Modules.Staking === section && StakingEvents.Slashed === method
}

function isBalancesDeposit(section, method) {
  return Modules.Balances === section && BalancesEvents.Deposit === method
}

async function handleSlashedEvent(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort <= 1) {
    return;
  }

  if (typeof indexer.extrinsicIndex !== 'undefined') {
    return
  }

  const preEvent = blockEvents[sort - 1];
  const { event: { section: preSection, method: preMethod, }, } = preEvent;
  if (isSlashedEvent(preSection, preMethod)) {
    return saveSlashed(event, indexer)
  }

  const prePreEvent = blockEvents[sort - 2];
  const { event: { section: prePreSection, method: prePreMethod, }, } = prePreEvent;
  const prePrePreEvent = blockEvents[sort - 3];
  if (!prePrePreEvent) {
    return
  }
  const { event: { section: prePrePreSection, method: prePrePreMethod, }, } = prePrePreEvent;

  if (
    isBalancesDeposit(preSection, preMethod) &&
    isBalancesDeposit(prePreSection, prePreMethod) &&
    isSlashedEvent(prePrePreSection, prePrePreMethod)
  ) {
    return await saveSlashed(event, indexer);
  }
}

async function saveSlashed(event, indexer) {
  const obj = {
    indexer,
    section: Modules.Staking,
    method: StakingEvents.Slashed,
    balance: event.data[0].toString(),
  }

  const col = await getStakingSlashCollection()
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleSlashedEvent,
}
