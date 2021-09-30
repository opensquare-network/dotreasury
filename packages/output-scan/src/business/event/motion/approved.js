const { handleBusinessWhenMotionApproved } = require("./hooks/approved");
const { updateMotionByHash } = require("../../../mongo/service/motion");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../common/constants");

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
  await handleBusinessWhenMotionApproved(hash, indexer);
}

module.exports = {
  handleApproved,
};
