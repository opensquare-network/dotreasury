const { getIncomeInflationCollection } = require("../../../../mongo/data");
const {
  Modules,
  StakingEvents,
} = require("../../../common/constants");

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
    indexer: {
      ...indexer,
      eventIndex: indexer.eventIndex - 1,
    },
    balance,
  }
  const col = await getIncomeInflationCollection();
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleEraPayout,
}
