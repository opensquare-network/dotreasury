const { updateProposal } = require("../../../../mongo/service/treasuryProposal");
const {
  env: { currentChain },
  consts: {
    BountyMethods,
    BountyStatus,
    TreasuryProposalMethods,
    TreasuryProposalEvents,
  }
} = require("@osn/scan-common");
const { updateBounty } = require("../../../../mongo/service/bounty");
const { getBountyMeta } = require("../../../common/bounty/meta");
const { getMotionCollection } = require("../../../../mongo");

async function handleRejectTreasuryProposal(proposalInfo, indexer) {
  if (currentChain() !== 'kusama') {
    return
  }

  const { index: proposalIndex, method } = proposalInfo;

  if (method !== TreasuryProposalMethods.rejectProposal) {
    return
  }

  // There is no Rejected event before kusama treasury proposal 11
  if (proposalIndex > 10) {
    return
  }

  const state = {
    state: TreasuryProposalEvents.Rejected,
    indexer,
  };

  await updateProposal(proposalIndex, { state });
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

async function handleBusinessWhenMotionExecuted(motionHash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash: motionHash, isFinal: false });
  if (!motion) {
    return;
  }

  for (const proposalInfo of motion.treasuryProposals || []) {
    await handleRejectTreasuryProposal(proposalInfo, indexer);
  }

  for (const bountyInfo of motion.treasuryBounties || []) {
    await handleBounty(bountyInfo, indexer);
  }
}

module.exports = {
  handleBusinessWhenMotionExecuted,
}
