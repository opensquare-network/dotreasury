const { updateReferendumByIndex } = require("../../../../mongo/service/democracyReferendum");
const { getReferendumInfoByHeight } = require("../../../common/democracy/referendum");
const {
  consts: {
    ReferendumEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");

async function handleCanceled(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const referendumInfo = await getReferendumInfoByHeight(
    referendumIndex,
    indexer.blockHeight - 1
  );

  const state = {
    indexer,
    state: ReferendumEvents.Cancelled,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Cancelled,
    args: {
      referendumIndex,
    },
    indexer,
  };

  await updateReferendumByIndex(
    referendumIndex,
    {
      info: referendumInfo,
      state,
    },
    timelineItem
  );
}

module.exports = {
  handleCanceled,
}
