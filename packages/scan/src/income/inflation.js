const { Modules, StakingEvents } = require("../utils/constants");

// Inflation
function handleStakingEraPayout(event, sort, allBlockEvents, blockIndexer) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (sort <= 0 || !phase.isNull) {
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
    balance,
    treasuryDepositEventData,
    eraPayoutEventData,
  };
  // TODO: insert data to MongoDB

  return data;
}

module.exports = {
  handleStakingEraPayout,
};
