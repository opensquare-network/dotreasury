const { getTotalIssuance } = require("../../../common/balance/totalIssuance");
const { updateReferendumByIndex } = require("../../../../mongo/service/democracyReferendum");
const {
  consts: {
    ReferendumEvents,
    TimelineItemTypes,
  }
} = require("@osn/scan-common")
const { getReferendumInfoByHeight } = require("../../../common/democracy/referendum");

async function handleVoteFinished(event, indexer) {
  const eventData = event.data.toJSON();
  const [referendumIndex] = eventData;

  const infoBeforePassed = await getReferendumInfoByHeight(
    referendumIndex,
    indexer.blockHeight - 1
  );
  const tally = infoBeforePassed.ongoing.tally;
  const electorate = await getTotalIssuance(indexer.blockHash);

  const state = {
    indexer,
    state: ReferendumEvents.Passed,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: event.method,
    args: {
      referendumIndex,
    },
    indexer,
  };

  await updateReferendumByIndex(
    referendumIndex,
    {
      tally: {
        ...tally,
        electorate,
      },
      state,
    },
    timelineItem
  );
}

module.exports = {
  handleVoteFinished,
}
