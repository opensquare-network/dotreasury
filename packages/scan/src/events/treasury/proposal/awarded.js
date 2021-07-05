const {
  ProposalEvents,
  timelineItemTypes,
} = require("../../../utils/constants");
const { updateProposalInDb } = require("./common");

async function handleAwarded(event, eventIndexer) {
  const eventData = event.data.toJSON();
  const [proposalIndex, value, beneficiary] = eventData;

  const state = {
    name: ProposalEvents.Awarded,
    data: eventData,
    eventIndexer,
  };

  const timelineItem = {
    type: timelineItemTypes.event,
    name: ProposalEvents.Awarded,
    args: {
      proposalIndex,
      value,
      beneficiary,
    },
    eventData,
    eventIndexer,
  };

  await updateProposalInDb(proposalIndex, {
    $set: { state },
    $push: { timeline: timelineItem },
  });
}

module.exports = {
  handleAwarded,
};
