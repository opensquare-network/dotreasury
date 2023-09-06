const { updateReferendumByIndex } = require("../../../../mongo/service/democracyReferendum");
const {
  consts: {
    ReferendumEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");

async function handleExecuted(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex, executeResult] = eventData;

  const state = {
    indexer,
    state: ReferendumEvents.Executed,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Executed,
    args: {
      referendumIndex,
      result: executeResult,
    },
    indexer,
  };

  await updateReferendumByIndex(referendumIndex, { state }, timelineItem);
}

module.exports = {
  handleExecuted,
}
