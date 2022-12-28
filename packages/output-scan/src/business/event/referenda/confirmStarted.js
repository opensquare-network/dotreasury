const {
  updateReferendaReferendum,
  insertReferendaReferendumTimeline
} = require("../../../mongo/service/referendaReferendum");
const { getOngoingUpdates } = require("./common/getOngoingUpdates");

async function handleConfirmStarted(event, indexer) {
  const referendumIndex = event.data[0].toNumber();

  const updates = await getOngoingUpdates(referendumIndex, indexer);
  await updateReferendaReferendum(referendumIndex, updates);
  await insertReferendaReferendumTimeline({
    referendumIndex,
    indexer,
    name: event.method,
    args: {},
  });
}

module.exports = {
  handleConfirmStarted,
}
