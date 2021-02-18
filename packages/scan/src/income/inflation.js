const { Modules, StakingEvents, SessionEvents } = require("../utils/constants");
const { inflationLogger } = require("../utils/logger");

// Inflation
function handleStakingEraPayout(event, sort, allBlockEvents, blockIndexer) {
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
  const nextEvent = allBlockEvents[sort + 1];
  const {
    event: { section: nextEventSection, method: nextEventMethod },
  } = nextEvent;
  const preEraPayout =
    section === Modules.Staking && method === StakingEvents.EraPayout;
  const nextNewSession =
    nextEventSection === Modules.Session &&
    nextEventMethod === SessionEvents.NewSession;
  if (!preEraPayout || !nextNewSession) {
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

  inflationLogger.info(blockIndexer.blockHeight, balance);
  return data;
}

module.exports = {
  handleStakingEraPayout,
};
