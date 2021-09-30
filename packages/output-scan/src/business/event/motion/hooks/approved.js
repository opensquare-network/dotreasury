const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const { getMotionCollection } = require("../../../../mongo");
const {
  CouncilEvents,
  TreasuryProposalMethods,
} = require("../../../common/constants");

async function handleBusinessWhenMotionApproved(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  const { isTreasury, treasuryProposalIndex } = motion;
  if (!isTreasury) {
    return;
  }

  const { method } = motion.proposal || {};
  const isApproved = TreasuryProposalMethods.approveProposal === method;
  if (!isApproved) {
    return;
  }

  const state = {
    indexer,
    state: CouncilEvents.Approved,
  };

  await updateProposal(treasuryProposalIndex, { state });
}

module.exports = {
  handleBusinessWhenMotionApproved,
};
