const { updateReferendaReferendum, insertReferendaReferendumTimeline } = require("../../../mongo/service/referendaReferendum");
const { getOngoingUpdates } = require("./common/getOngoingUpdates");

async function handleDecisionDepositPlaced(event, indexer) {
  const referendumIndex = event.data[0].toNumber();
  const who = event.data[1].toString();
  const amount = event.data[2].toString();

  const updates = await getOngoingUpdates(referendumIndex, indexer);
  await updateReferendaReferendum(referendumIndex, updates);
  await insertReferendaReferendumTimeline({
    referendumIndex,
    indexer,
    name: event.method,
    args: {
      who,
      amount,
    },
  })
}

module.exports = {
  handleDecisionDepositPlaced,
}
