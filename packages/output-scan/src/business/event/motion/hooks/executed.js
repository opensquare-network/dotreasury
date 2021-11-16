const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const { currentChain } = require("../../../../env");
const { updateBounty } = require("../../../../mongo/service/bounty");
const { getBountyMeta } = require("../../../common/bounty/meta");
const { getMotionCollection } = require("../../../../mongo");
const {
  BountyMethods,
  BountyStatus,
  TreasuryProposalMethods,
  TreasuryProposalEvents,
} = require("../../../common/constants");

async function handleRejectTreasuryProposal(motion, indexer) {
  if (currentChain() !== 'kusama') {
    return
  }

  const { isTreasuryProposal, proposal: { method }, treasuryProposalIndex } = motion;
  if (!isTreasuryProposal) {
    return
  }

  if (method !== TreasuryProposalMethods.rejectProposal) {
    return
  }

  // There is no Rejected event before kusama treasury proposal 11
  if (treasuryProposalIndex > 10) {
    return
  }

  const state = {
    state: TreasuryProposalEvents.Rejected,
    indexer,
  };

  await updateProposal(treasuryProposalIndex, { state });
}

async function handleBusinessWhenMotionExecuted(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  await handleRejectTreasuryProposal(motion, indexer);

  const { isTreasuryBounty, treasuryBountyId } = motion;
  if (!isTreasuryBounty) {
    return;
  }

  const meta = await getBountyMeta(indexer.blockHash, treasuryBountyId);
  if (!meta) {
    return
  }

  let updates = {
    meta,
  }

  const { proposal: { method } } = motion;
  if (BountyMethods.approveBounty === method) {
    updates = {
      ...updates,
      state: {
        indexer,
        state: BountyStatus.Approved,
      }
    }
  }

  await updateBounty(treasuryBountyId, updates);
}

module.exports = {
  handleBusinessWhenMotionExecuted,
}
