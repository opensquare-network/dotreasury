const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const { getMotionCollection } = require("../../../../mongo");
const {
  TreasuryProposalEvents,
} = require("../../../common/constants");

async function handleBusinessWhenMotionDisApproved(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  const { isTreasury, treasuryProposalIndex } = motion;
  if (!isTreasury) {
    return;
  }

  const state = {
    indexer,
    // If a treasury proposal motion is not passed, we reset the treasury proposal state to `Proposed`
    state: TreasuryProposalEvents.Proposed,
  };

  await updateProposal(treasuryProposalIndex, { state });
}

module.exports = {
  handleBusinessWhenMotionDisApproved,
};
