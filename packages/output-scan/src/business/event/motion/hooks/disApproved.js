const { updateBounty } = require("../../../../mongo/service/bounty");
const { getBountyMeta } = require("../../../common/bounty/meta");
const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const { getMotionCollection } = require("../../../../mongo");
const {
  TreasuryProposalEvents,
} = require("../../../common/constants");

async function checkAndHandleBounty(motion, indexer) {
  const { isTreasuryBounty, treasuryBountyId } = motion;
  if (!isTreasuryBounty) {
    return;
  }

  const meta = await getBountyMeta(indexer.blockHash, treasuryBountyId);
  if (meta) {
    await updateBounty(treasuryBountyId, { meta, });
  }
}

async function checkAndHandleProposal(motion, indexer) {
  const { isTreasuryProposal, treasuryProposalIndex } = motion;
  if (!isTreasuryProposal) {
    return;
  }

  const state = {
    indexer,
    // If a treasury proposal motion is not passed, we reset the treasury proposal state to `Proposed`
    state: TreasuryProposalEvents.Proposed,
  };

  await updateProposal(treasuryProposalIndex, { state });
}

async function handleBusinessWhenMotionDisApproved(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  await checkAndHandleBounty(motion, indexer);
  await checkAndHandleProposal(motion, indexer);
}

module.exports = {
  handleBusinessWhenMotionDisApproved,
};
