const { getIncomeInflationCollection } = require("../../../../mongo/data");
const {
  consts: {
    Modules,
    StakingEvents,
  }
} = require("@osn/scan-common");

function isBalancesDeposit(section, method) {
  return Modules.Balances === section && "Deposit" === method
}

function isEraPaid(section, method) {
  return section === Modules.Staking && method === StakingEvents.EraPaid
}

async function handleEraPaid(event, indexer, blockEvents) {
  if (typeof indexer.extrinsicIndex !== 'undefined') {
    return
  }

  const sort = indexer.eventIndex;
  if (sort <= 0) {
    return;
  }

  const preEvent = blockEvents[sort - 1];
  const { event: { section: preSection, method: preMethod, }, } = preEvent;

  let isInflation = false;
  if (sort === 1 && isEraPaid(preSection, preMethod)) {
    isInflation = true
  } else if (sort > 1) {
    const prePreEvent = blockEvents[sort - 2];
    const { event: { section: prePreSection, method: prePreMethod, }, } = prePreEvent;
    isInflation = isEraPaid(preSection, preMethod) ||
      isBalancesDeposit(preSection, preMethod) && isEraPaid(prePreSection, prePreMethod)
  }

  if (!isInflation) {
    return
  }

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

module.exports = {
  handleEraPaid,
}
