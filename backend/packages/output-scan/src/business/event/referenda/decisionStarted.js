const {
  updateReferendaReferendum,
  insertReferendaReferendumTimeline
} = require("../../../mongo/service/referendaReferendum");
const { getOngoingUpdates } = require("./common/getOngoingUpdates");

async function handleDecisionStarted(event, indexer) {
  const referendumIndex = event.data[0].toNumber();
  const track = event.data[1].toNumber();
  const tally = event.data[3].toJSON();

  const updates = await getOngoingUpdates(referendumIndex, indexer);
  await updateReferendaReferendum(referendumIndex, updates);
  await insertReferendaReferendumTimeline({
    referendumIndex,
    indexer,
    name: event.method,
    args: {
      track,
      tally,
    },
  });
}

module.exports = {
  handleDecisionStarted,
}
