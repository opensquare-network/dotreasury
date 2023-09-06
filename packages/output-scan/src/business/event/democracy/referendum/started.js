const { getReferendumInfoFromStorage } = require("../../../common/democracy/referendum");
const omit = require("lodash.omit");
const { handleBusinessWhenReferendumStarted } = require("./hooks/started");
const { queryPreimageCall } = require("../../../common/democracy/preimage");
const { insertDemocracyReferendum } = require("../../../../mongo/service/democracyReferendum");
const {
  consts: {
    ReferendumEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common");

async function handleStarted(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex, threshold] = eventData;

  const referendumInfo = await getReferendumInfoFromStorage(
    referendumIndex,
    indexer
  );

  if (!referendumInfo) {
    // this is because the preimage has not been uploaded to chain since the referendum has started. We just ignore this
    // now.
    return;
  }

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

  const meta = omit(referendumInfo?.ongoing, ['tally'])
  await insertDemocracyReferendum({
    indexer,
    referendumIndex,
    meta,
    info: referendumInfo,
    state,
    timeline: [timelineItem],
    treasuryProposals: [],
  });

  const call = await queryPreimageCall(meta.proposalHash, indexer);
  // note that the preimage maybe submitted after referendum started, but currently we will not handle this branch.
  if (call) {
    await handleBusinessWhenReferendumStarted(referendumIndex, meta, call, indexer);
  }
}

module.exports = {
  handleStarted,
}
