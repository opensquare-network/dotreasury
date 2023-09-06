const { updateProposal } = require("../../../mongo/service/treasuryProposal");
const {
  logger,
  consts: {
    TreasuryProposalEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");

async function handleAwarded(event, eventIndexer) {
  const eventData = event.data.toJSON();
  const [proposalIndex, award, beneficiary] = eventData;

  const state = {
    state: TreasuryProposalEvents.Awarded,
    data: eventData,
    indexer: eventIndexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: TreasuryProposalEvents.Awarded,
    args: {
      award,
      beneficiary,
    },
    indexer: eventIndexer,
  };

  await updateProposal(proposalIndex, {
    awardHeight: eventIndexer.blockHeight,
    state,
    isFinal: true,
  }, timelineItem);
  logger.info(`Treasury proposal ${ proposalIndex } awarded at`, eventIndexer);
}

module.exports = {
  handleAwarded,
}
