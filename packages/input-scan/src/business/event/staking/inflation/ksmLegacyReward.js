const { getIncomeInflationCollection } = require("../../../../mongo/data");
const {
  Modules,
  StakingEvents
} = require("../../../common/constants");
const {
  currentChain,
  CHAINS,
} = require("../../../../env");

async function handleKsmLegacyReward(event, indexer, blockEvents) {
  if (CHAINS.KUSAMA !== currentChain() || indexer.blockHeight >= 1379482) {
    return
  }

  const sort = indexer.eventIndex;
  if (sort <= 0) {
    return;
  }

  const preEvent = blockEvents[sort - 1];
  const {
    event: { section, method, },
  } = preEvent;
  if (section !== Modules.Staking || method !== StakingEvents.Reward) {
    return;
  }

  const balance = event.data[0].toString();
  const obj = {
    indexer: {
      ...indexer,
      eventIndex: sort - 1,
    },
    balance,
  }
  const col = await getIncomeInflationCollection()
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleKsmLegacyReward,
}
