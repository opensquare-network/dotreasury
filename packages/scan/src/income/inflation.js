const { Modules, StakingEvents } = require("../utils/constants");
const { getIncomeInflationCollection } = require("../mongo");

const inflationEndHeight = 1379482;

async function saveInflationRecord(data) {
  const col = await getIncomeInflationCollection();
  await col.insertOne(data);
}

async function checkInflation1(event, sort, allBlockEvents, blockIndexer) {
  if (blockIndexer.blockHeight >= inflationEndHeight) {
    return;
  }

  const {
    event: { data: treasuryDepositData },
  } = event; // get deposit event data
  if (sort <= 0) {
    return;
  }

  const preEvent = allBlockEvents[sort - 1];
  const {
    event: { section, method, data: rewardData },
  } = preEvent;
  if (section !== Modules.Staking || method !== StakingEvents.Reward) {
    return;
  }

  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const rewardEventData = rewardData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const data = {
    indexer: blockIndexer,
    eventSort: sort - 1,
    balance,
    treasuryDepositEventData,
    rewardEventData,
  };

  await saveInflationRecord(data);

  return data;
}

// Inflation
async function handleStakingEraPayout(
  event,
  sort,
  allBlockEvents,
  blockIndexer
) {
  const inflationCheck1Data = await checkInflation1(
    event,
    sort,
    allBlockEvents,
    blockIndexer
  );
  if (inflationCheck1Data) {
    return inflationCheck1Data;
  }

  const {
    event: { data: treasuryDepositData },
  } = event; // get deposit event data
  if (sort <= 0 || sort >= allBlockEvents.length - 1) {
    return;
  }

  const preEvent = allBlockEvents[sort - 1];
  const {
    event: { section, method, data: eraPayoutData },
  } = preEvent;
  if (section !== Modules.Staking || method !== StakingEvents.EraPayout) {
    return;
  }

  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const eraPayoutEventData = eraPayoutData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const data = {
    indexer: blockIndexer,
    eventSort: sort - 1,
    balance,
    treasuryDepositEventData,
    eraPayoutEventData,
  };

  await saveInflationRecord(data);

  return data;
}

module.exports = {
  handleStakingEraPayout,
};
