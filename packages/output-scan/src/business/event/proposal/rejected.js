const { updateProposal } = require("../../../mongo/service/treasuryProposal");
const {
  logger,
  consts: {
    TreasuryProposalEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");

async function handleRejected(event, eventIndexer) {
  const eventData = event.data.toJSON();
  const [proposalId, value] = eventData;

  const state = {
    state: TreasuryProposalEvents.Rejected,
    data: eventData,
    indexer: eventIndexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    name: TreasuryProposalEvents.Rejected,
    args: {
      proposalIndex: proposalId,
      value,
    },
    eventData,
    indexer: eventIndexer,
  };

  await updateProposal(proposalId, { state }, timelineItem);
  logger.info(`Treasury proposal ${ proposalId } rejected at`, eventIndexer);
}

module.exports = {
  handleRejected,
}
