const { Modules, ElectionsPhragmenEvents } = require("../../utils/constants");
const { electionsPhragmenLogger } = require("../../utils/logger");

function handleElectionsPhragmenSlash(
  event,
  sort,
  allBlockEvents,
  blockIndexer
) {
  const {
    event: { data: treasuryDepositData },
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1) {
    return;
  }

  const nextEvent = allBlockEvents[sort + 1];
  const {
    event: { section, method },
  } = nextEvent;
  if (
    section !== Modules.ElectionsPhragmen ||
    ![
      ElectionsPhragmenEvents.CandidateSlashed,
      ElectionsPhragmenEvents.SeatHolderSlashed,
    ].includes(method)
  ) {
    return;
  }

  const nextEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const key =
    ElectionsPhragmenEvents.CandidateSlashed === method
      ? "candidateSlashedEventData"
      : "seatHolderSlashedEventData";

  const data = {
    indexer: blockIndexer,
    section,
    method,
    balance,
    treasuryDepositEventData,
    [key]: nextEventData,
  };
  electionsPhragmenLogger.info(blockIndexer.blockHeight, method);
  return data;
}

module.exports = {
  handleElectionsPhragmenSlash,
};
