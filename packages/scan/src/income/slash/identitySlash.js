const { Modules, IdentityEvents } = require("../../utils/constants");
const { incomeLogger } = require("../../utils");

function handleIdentitySlash(event, sort, allBlockEvents, blockIndexer) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1 || phase.isNull) {
    return;
  }

  const nextEvent = allBlockEvents[sort + 1];
  const {
    event: { section, method },
  } = nextEvent;
  if (
    section !== Modules.Identity ||
    method !== IdentityEvents.IdentityKilled
  ) {
    return;
  }

  const identityKilledEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const data = {
    indexer: blockIndexer,
    section,
    method,
    balance,
    treasuryDepositEventData,
    identityKilledEventData,
  };
  incomeLogger.info(`identity slash detected`, data);
  return data;
}

module.exports = {
  handleIdentitySlash,
};
