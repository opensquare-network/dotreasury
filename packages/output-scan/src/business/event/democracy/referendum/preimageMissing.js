const { updateReferendumByIndex } = require("../../../../mongo/service/democracyReferendum");
const {
  consts: {
    ReferendumEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");

async function handlePreimageMissing(event, indexer) {
  const eventData = event.data.toJSON();
  const [proposalHash, referendumIndex] = eventData;

  const state = {
    indexer,
    state: ReferendumEvents.PreimageMissing,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.PreimageMissing,
    args: {
      proposalHash,
      referendumIndex,
    },
    indexer,
  };

  await updateReferendumByIndex(referendumIndex, { state }, timelineItem);
}

module.exports = {
  handlePreimageMissing,
}
