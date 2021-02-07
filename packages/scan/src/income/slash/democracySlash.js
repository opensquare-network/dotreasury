const { Modules, DemocracyEvents } = require("../../utils/constants");

function handleDemocracyBacklistedOrPreimageInvalid(
  event,
  sort,
  allBlockEvents,
  blockIndexer
) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1 || phase.isNull) {
    return;
  }

  const nextEvent = allBlockEvents[sort - 1];
  const {
    event: { section, method },
  } = nextEvent;
  if (
    section !== Modules.Democracy ||
    ![DemocracyEvents.Blacklisted, DemocracyEvents.PreimageInvalid].includes(
      method
    )
  ) {
    return;
  }

  const nextEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const key =
    DemocracyEvents.Blacklisted === method
      ? "backListedEventData"
      : "preimageInvalidEventData";

  const data = {
    indexer: blockIndexer,
    section,
    method,
    balance,
    treasuryDepositEventData,
    [key]: nextEventData,
  };
}

module.exports = {
  handleDemocracyBacklistedOrPreimageInvalid,
};
