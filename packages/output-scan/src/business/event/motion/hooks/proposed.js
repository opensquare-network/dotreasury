const { handleWrappedCall } = require("../../../common/call");
const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const {
  Modules,
  TreasuryProposalMethods,
  MotionState,
} = require("../../../common/constants");

function isProposalMotion(section, method) {
  return Modules.Treasury === section &&
    [
      TreasuryProposalMethods.approveProposal,
      TreasuryProposalMethods.rejectProposal,
    ].includes(method)
}

async function handleProposalCall(call, author, indexer, events) {
  const { section, method, args } = call;
  if (!isProposalMotion(section, method)) {
    return
  }

  const treasuryProposalIndex = args[0].toJSON();
  const motionInfo = {
    indexer,
    method,
    proposer: author,
  }

  const stateName =
    method === TreasuryProposalMethods.approveProposal
      ? MotionState.ApproveVoting
      : MotionState.RejectVoting;

  const state = {
    indexer,
    state: stateName,
    data: {
      motionState: this.motion.state,
      motionVoting: this.motion.voting,
    },
  };

  await updateProposal(treasuryProposalIndex, { state }, null, motionInfo);
}

async function handleBusinessWhenMotionProposed(motionDbObj = {}, rawProposal, indexer, blockEvents) {
  await handleWrappedCall(
    rawProposal,
    motionDbObj.proposer,
    indexer,
    blockEvents,
    handleProposalCall.bind({ motion: motionDbObj }),
  )

  // todo: handle bounty
}

module.exports = {
  handleBusinessWhenMotionProposed,
};
