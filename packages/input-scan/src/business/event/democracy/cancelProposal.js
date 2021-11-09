const { getDemocracySlashCollection } = require("../../../mongo/data");
const { getMotionProposalByHeight } = require("../../common/motion/proposalStorage");
const {
  Modules,
  CouncilEvents,
  DemocracyMethods,
} = require("../../common/constants")

async function handleCancelProposalSlash(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  if (sort <= 0) {
    return;
  }

  const preEvent = blockEvents[sort - 1];
  const { event: { section, method, }, } = preEvent;

  if (Modules.Council !== section || method !== CouncilEvents.Executed) {
    return
  }

  const proposalHash = preEvent.event.data[0].toString()
  const call = await getMotionProposalByHeight(proposalHash, indexer.blockHeight - 1);
  if (Modules.Democracy !== call.section || DemocracyMethods.cancelProposal !== call.method) {
    return
  }
  const proposalIndex = call.args[0].value;

  const obj = {
    indexer,
    section: Modules.Democracy,
    method: call.method,
    balance: event.data[0].toString(),
    canceledProposalIndex: proposalIndex,
  }

  const col = await getDemocracySlashCollection()
  await col.insertOne(obj)
  return obj;
}

module.exports = {
  handleCancelProposalSlash,
}
