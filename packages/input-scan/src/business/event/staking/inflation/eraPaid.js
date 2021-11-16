const { getIncomeInflationCollection } = require("../../../../mongo/data");
const {
  Modules,
  StakingEvents,
  BalancesEvents,
} = require("../../../common/constants");

function isBalancesDeposit(section, method) {
  return Modules.Balances === section && BalancesEvents.Deposit === method
}

function isEraPaid(section, method) {
  return section === Modules.Staking && method === StakingEvents.EraPaid
}

async function handleEraPaid(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort <= 0) {
    return;
  }

  if (typeof indexer.extrinsicIndex !== 'undefined') {
    return
  }

  const preEvent = blockEvents[sort - 1];
  const { event: { section: preSection, method: preMethod, }, } = preEvent;
  const prePreEvent = blockEvents[sort - 2];
  const { event: { section: prePreSection, method: prePreMethod, }, } = prePreEvent;
  if (
    isEraPaid(preSection, preMethod) ||
    isBalancesDeposit(preSection, preMethod) && isEraPaid(prePreSection, prePreMethod)
  ) {
    const balance = event.data[0].toString();

    const obj = {
      indexer,
      balance,
      section: Modules.Staking,
      method: StakingEvents.EraPaid,
    }
    const col = await getIncomeInflationCollection();
    await col.insertOne(obj);
    return obj;
  }
}

module.exports = {
  handleEraPaid,
}
