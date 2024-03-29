const { handleBusinessWhenMotionExecuted } = require("./hooks/executed");
const { updateMotionByHash } = require("../../../mongo/service/motion");
const {
  consts: {
    TimelineItemTypes,
    CouncilEvents,
  }
} = require("@osn/scan-common");

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

  let isOk;
  if (typeof dispatchResult === 'boolean') {
    isOk = dispatchResult;
  } else {
    isOk = Object.keys(dispatchResult).includes("ok");
  }

  await handleBusinessWhenMotionExecuted(hash, indexer, isOk);
  const updates = { state, isFinal: true };
  await updateMotionByHash(hash, updates, timelineItem);
}

module.exports = {
  handleExecuted,
};
