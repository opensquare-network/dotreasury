const { getMotionCollection } = require("../../../../mongo");
const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const {
  TreasuryProposalMethods,
  MotionState,
} = require("../../../common/constants");

async function handleBusinessWhenMotionVoted(motionHash, voting, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash });
  if (!motion) {
    return;
  }

  const { isTreasury, treasuryProposalIndex } = motion;
  if (!isTreasury) {
    return;
  }

  const { method } = motion.proposal;
  const stateName =
    method === TreasuryProposalMethods.approveProposal
      ? MotionState.ApproveVoting
      : MotionState.RejectVoting;

  const state = {
    indexer,
    state: stateName,
    data: {
      motionState: motion.state,
      motionVoting: voting,
    },
  };

  await updateProposal(treasuryProposalIndex, { state });
}

module.exports = {
  handleBusinessWhenMotionVoted,
};
