const { updateMotionByHash } = require("../../../mongo/service/motion");
const {
  consts: {
    TimelineItemTypes,
    CouncilEvents,
  }
} = require("@osn/scan-common");

async function handleApproved(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const state = {
    state: CouncilEvents.Approved,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Approved,
    args: {
      hash,
    },
    indexer,
  };

  const updates = { state };
  await updateMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleApproved,
};
