const { updateReferendumByIndex } = require("../../../../mongo/service/democracyReferendum");
const {
  consts: {
    ReferendumEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");

async function handlePreimageInvalid(event, indexer) {
  const eventData = event.data.toJSON();
  const [proposalHash, referendumIndex] = eventData;

  const state = {
    indexer,
    state: ReferendumEvents.PreimageInvalid,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.PreimageInvalid,
    args: {
      proposalHash,
      referendumIndex,
    },
    indexer,
  };

  await updateReferendumByIndex(referendumIndex, { state }, timelineItem);
}

module.exports = {
  handlePreimageInvalid,
}
