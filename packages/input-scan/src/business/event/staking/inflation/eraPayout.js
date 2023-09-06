const { getIncomeInflationCollection } = require("../../../../mongo/data");
const {
  consts: {
    Modules,
    StakingEvents,
  }
} = require("@osn/scan-common")

async function handleEraPayout(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort <= 0 || sort >= blockEvents.length - 1) {
    return;
  }

  const preEvent = blockEvents[sort - 1];
  const {
    event: { section, method, },
  } = preEvent;
  if (section !== Modules.Staking || method !== StakingEvents.EraPayout) {
    return;
  }

  const balance = event.data[0].toString();

  const obj = {
    indexer,
    balance,
  }
  const col = await getIncomeInflationCollection();
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleEraPayout,
}
