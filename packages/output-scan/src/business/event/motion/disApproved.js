const { handleBusinessWhenMotionDisApproved } = require("./hooks/disApproved");
const { updateMotionByHash } = require("../../../mongo/service/motion");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../common/constants");

async function handleDisApproved(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const state = {
    state: CouncilEvents.Disapproved,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Disapproved,
    args: {
      hash,
    },
    indexer,
  };

  await handleBusinessWhenMotionDisApproved(hash, indexer);
  const updates = { state, isFinal: true };
  await updateMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleDisApproved,
};
