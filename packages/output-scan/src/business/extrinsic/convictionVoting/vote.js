const { addReferendaAlarmAt } = require("../../../store/referendaAlarm");
const { getOngoingUpdates } = require("../../event/referenda/common/getOngoingUpdates");
const { updateReferendaReferendum } = require("../../../mongo/service/referendaReferendum");

async function handleConvictionVotingVote(call, extrinsicIndexer) {
  const { section, method, args } = call;
  if ("convictionVoting" !== section || "vote" !== method) {
    return
  }

  const referendumIndex = args[0].toNumber();
  const updates = await getOngoingUpdates(referendumIndex, extrinsicIndexer);
  await updateReferendaReferendum(referendumIndex, updates);

  addReferendaAlarmAt(extrinsicIndexer.blockHeight + 1, referendumIndex);
}

module.exports = {
  handleConvictionVotingVote,
}
