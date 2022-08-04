const { getReferendumInfoFromStorage } = require("../../../common/democracy/referendum");
const omit = require("lodash.omit");
const { insertDemocracyReferendum } = require("../../../../mongo/service/democracyReferendum");
const {
  consts: {
    ReferendumEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common")

async function handleStarted(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex, threshold] = eventData;

  const referendumInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    indexer
  );

  const meta = omit(referendumInfo?.ongoing, ['tally'])
  const state = {
    indexer,
    state: ReferendumEvents.Started,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: ReferendumEvents.Started,
    args: {
      referendumIndex,
      voteThreshold: threshold,
    },
    indexer,
  };

  await insertDemocracyReferendum({
    indexer,
    referendumIndex,
    meta,
    info: referendumInfo,
    state,
    timeline: [timelineItem],
  });
}

module.exports = {
  handleStarted,
}
