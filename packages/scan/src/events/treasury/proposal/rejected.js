const {
  ProposalEvents,
  timelineItemTypes,
} = require("../../../utils/constants");
const { updateProposalInDb } = require("./common");

async function handleRejected(event, eventIndexer) {
  const eventData = event.data.toJSON();
  const [proposalId, value] = eventData;

  const state = {
    name: ProposalEvents.Rejected,
    data: eventData,
    eventIndexer,
  };

  const timelineItem = {
    type: timelineItemTypes.event,
    name: ProposalEvents.Rejected,
    args: {
      proposalIndex: proposalId,
      value,
    },
    eventData,
    eventIndexer,
  };

  await updateProposalInDb(proposalId, {
    $set: { state },
    $push: { timeline: timelineItem },
  });
}

module.exports = {
  handleRejected,
};
