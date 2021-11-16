const { getStakingSlashCollection } = require("../../../../mongo/data");
const {
  Modules,
  StakingEvents,
  BalancesEvents,
} = require("../../../common/constants")

function isSlashed(section, method) {
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
  const prePreEvent = blockEvents[sort - 2];
  const { event: { section: prePreSection, method: prePreMethod, }, } = prePreEvent;
  const prePrePreEvent = blockEvents[sort - 3];
  const { event: { section: prePrePreSection, method: prePrePreMethod, }, } = prePrePreEvent;

  if (
    isSlashed(preSection, preMethod) ||
    isBalancesDeposit(preSection, preMethod) && isBalancesDeposit(prePreSection, prePreMethod) &&
    isSlashed(prePrePreSection, prePrePreMethod)
  ) {
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
}

module.exports = {
  handleSlashedEvent,
}
