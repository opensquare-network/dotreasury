const { getDemocracySlashCollection } = require("../../../mongo/data");
const { getMotionProposalByHeight } = require("../../common/motion/proposalStorage");
const {
  Modules,
  CouncilEvents,
  DemocracyMethods,
  TreasuryCommonEvent,
} = require("../../common/constants")

async function handleCancelProposalSlash(event, indexer, blockEvents) {
  const { section, method } = event;
  if (Modules.Council !== section || method !== CouncilEvents.Executed) {
    return
  }

  const proposalHash = event.data[0].toString()
  const call = await getMotionProposalByHeight(proposalHash, indexer.blockHeight - 1);
  if (Modules.Democracy !== call.section || DemocracyMethods.cancelProposal !== call.method) {
    return
  }

  const proposalIndex = call.args[0].value;
  const nextEvent = blockEvents[indexer.blockHeight + 1];
  if (!nextEvent) {
    return
  }

  const {
    event: { section: nextSection, method: nextMethod, data }
  } = nextEvent;

  if (Modules.Treasury !== nextSection || TreasuryCommonEvent.Deposit !== nextMethod) {
    return
  }

  const obj = {
    indexer,
    section: Modules.Democracy,
    method: call.method,
    balance: data[0].toString(),
    canceledProposalIndex: proposalIndex,
  }

  const col = await getDemocracySlashCollection()
  await col.insertOne(obj)
  return obj;
}

module.exports = {
  handleCancelProposalSlash,
}
