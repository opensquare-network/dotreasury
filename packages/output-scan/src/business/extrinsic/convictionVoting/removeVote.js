const { addReferendaAlarmAt } = require("../../../store");
const { getOngoingUpdates } = require("../../event/referenda/common/getOngoingUpdates");
const { updateReferendaReferendum } = require("../../../mongo/service/referendaReferendum");

async function handleConvictionVotingRemoveVote(call, extrinsicIndexer) {
  const { section, method, args } = call;
  if ("convictionVoting" !== section || "removeVote" !== method) {
    return
  }

  const referendumIndex = args[1].toNumber();
  const updates = await getOngoingUpdates(referendumIndex, extrinsicIndexer);
  await updateReferendaReferendum(referendumIndex, updates);

  addReferendaAlarmAt(extrinsicIndexer.blockHeight + 1, referendumIndex);
}

module.exports = {
  handleConvictionVotingRemoveVote,
}
