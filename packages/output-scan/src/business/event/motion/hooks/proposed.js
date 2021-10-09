const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const {
  TreasuryProposalMethods,
  MotionState,
} = require("../../../common/constants");

async function handleBusinessWhenMotionProposed(motionDbObj = {}, indexer) {
  const { isTreasuryProposal, treasuryProposalIndex } = motionDbObj;
  if (!isTreasuryProposal) {
    return;
  }

  const { method } = motionDbObj.proposal;
  const stateName =
    method === TreasuryProposalMethods.approveProposal
      ? MotionState.ApproveVoting
      : MotionState.RejectVoting;

  const state = {
    indexer,
    state: stateName,
    data: {
      motionState: motionDbObj.state,
      motionVoting: motionDbObj.voting,
    },
  };

  await updateProposal(treasuryProposalIndex, { state });
}

module.exports = {
  handleBusinessWhenMotionProposed,
};
