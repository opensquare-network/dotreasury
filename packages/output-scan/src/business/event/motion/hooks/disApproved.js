const { isStateChangeBountyMotion } = require("../../../common/bounty/utils/motion");
const { updateBounty } = require("../../../../mongo/service/bounty");
const { getBountyMeta } = require("../../../common/bounty/meta");
const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const { getMotionCollection } = require("../../../../mongo");
const {
  TreasuryProposalEvents,
  BountyStatus,
} = require("../../../common/constants");

async function handleBounty(bountyIndex, indexer) {
  const state = {
    indexer,
    // If a bounty proposal(close or approve) motion is not passed, we reset the treasury bounty state to `Proposed`
    state: BountyStatus.Proposed,
  };

  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);
  if (meta) {
    await updateBounty(bountyIndex, { meta, state });
  }
}

async function handleProposal(treasuryProposalIndex, indexer) {
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

  for (const { index } of motion.treasuryProposals || []) {
    await handleProposal(index, indexer);
  }

  for (const { index, method } of motion.treasuryBounties || []) {
    if (isStateChangeBountyMotion(method)) {
      await handleBounty(index, indexer);
    }
  }
}

module.exports = {
  handleBusinessWhenMotionDisApproved,
};
