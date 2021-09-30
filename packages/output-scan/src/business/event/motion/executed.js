const { updateMotionByHash } = require("../../../mongo/service/motion");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../common/constants");

async function handleExecuted(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, dispatchResult] = eventData;

  const state = {
    state: CouncilEvents.Executed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Executed,
    args: {
      hash,
      dispatchResult,
    },
    indexer,
  };

  const updates = { state, isFinal: true };
  await updateMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleExecuted,
};
