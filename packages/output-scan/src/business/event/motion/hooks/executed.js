const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const {
  env: { currentChain },
  consts: {
    BountyMethods,
    BountyStatus,
    TreasuryProposalMethods,
    TreasuryProposalEvents,
    CouncilEvents,
  }
} = require("@osn/scan-common");
const { updateBounty } = require("../../../../mongo/service/bounty");
const { getBountyMeta } = require("../../../common/bounty/meta");
const { getMotionCollection } = require("../../../../mongo");

async function handleApproveTreasuryProposal(proposalInfo, indexer, isOk) {
  const { index: proposalIndex, method } = proposalInfo;
  if (method !== TreasuryProposalMethods.approveProposal) {
    return
  }

  const state = {
    indexer,
    state: isOk ? CouncilEvents.Approved : TreasuryProposalEvents.Proposed,
  };

  await updateProposal(proposalIndex, { state });
}

async function handleRejectTreasuryProposal(proposalInfo, indexer, isOk) {
  if (currentChain() !== 'kusama') {
    return
  }

  const { index: proposalIndex, method } = proposalInfo;
  if (method !== TreasuryProposalMethods.rejectProposal) {
    return
  }

  // There is no Rejected event before kusama treasury proposal 11
  if (proposalIndex > 10 && isOk) {
    return
  }

  const state = {
    state: isOk ? TreasuryProposalEvents.Rejected : TreasuryProposalEvents.Proposed,
    indexer,
  };

  await updateProposal(proposalIndex, { state, isFinal: true });
}

async function handleBounty(bountyInfo, indexer) {
  const { index: bountyIndex, method } = bountyInfo;

  let updates = {};

  const meta = await getBountyMeta(indexer.blockHash, bountyIndex);
  if (meta) {
    updates.meta = meta
  }

  if (BountyMethods.approveBounty === method) {
    updates.state = {
      indexer,
      state: BountyStatus.Approved,
    }
  }

  if (updates.meta || updates.state) {
    await updateBounty(bountyIndex, updates);
  }
}

async function handleBusinessWhenMotionExecuted(motionHash, indexer, isOk = true) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  for (const proposalInfo of motion.treasuryProposals || []) {
    await handleRejectTreasuryProposal(proposalInfo, indexer, isOk);
    await handleApproveTreasuryProposal(proposalInfo, indexer, isOk);
  }

  if (!isOk) {
    return
  }
  for (const bountyInfo of motion.treasuryBounties || []) {
    await handleBounty(bountyInfo, indexer);
  }
}

module.exports = {
  handleBusinessWhenMotionExecuted,
}
