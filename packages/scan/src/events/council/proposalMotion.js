const { getMotionCollection, getProposalCollection } = require("../../mongo");
const {
  isProposalMotion,
  getMotionVoting,
  extractCallIndexAndArgs,
  getLatestMotionByHash,
} = require("./utils");
const { motionActions } = require("./constants");
const {
  Modules,
  CouncilEvents,
  ProposalEvents,
  ProposalMethods,
} = require("../../utils/constants");
const { asyncLocalStorage } = require("../../utils");

async function handleProposedForProposal(
  event,
  normalizedExtrinsic,
  extrinsic
) {
  const [section, method, args] = await extractCallIndexAndArgs(
    normalizedExtrinsic,
    extrinsic
  );

  if (section !== Modules.Treasury || !isProposalMotion(method)) {
    return;
  }

  const { proposal_id: treasuryProposalId } = args;
  const eventData = event.data.toJSON();
  const [proposer, index, hash] = eventData;
  const voting = await getMotionVoting(
    normalizedExtrinsic.extrinsicIndexer.blockHash,
    hash
  );
  // TODO: get MotionDuration

  const timeline = [
    {
      action: motionActions.Propose,
      eventData,
      extrinsic: normalizedExtrinsic,
    },
  ];

  const session = asyncLocalStorage.getStore();
  const col = await getMotionCollection();
  await col.insertOne(
    {
      hash,
      index,
      proposer,
      method,
      treasuryProposalId,
      voting,
      state: {
        state: CouncilEvents.Proposed,
        eventData,
        extrinsic: normalizedExtrinsic,
      },
      timeline,
    },
    { session }
  );

  await updateProposalStateByProposeOrVote(
    hash,
    normalizedExtrinsic.extrinsicIndexer
  );
}

async function updateProposalStateByProposeOrVote(hash, indexer) {
  const motion = await getLatestMotionByHash(hash);
  if (!motion || !isProposalMotion(motion.method)) {
    // it means this motion hash is not a treasury proposal motion hash
    return;
  }

  const motionState = motion.state;
  const motionVoting = motion.voting;
  const name =
    motion.method === ProposalMethods.approveProposal
      ? "ApproveVoting"
      : "RejectVoting";

  const session = asyncLocalStorage.getStore();
  const proposalCol = await getProposalCollection();
  await proposalCol.findOneAndUpdate(
    { proposalIndex: motion.treasuryProposalId },
    {
      $set: {
        state: {
          name,
          indexer,
          motionState,
          motionVoting,
        },
      },
    },
    { session }
  );
}

async function updateProposalStateByVoteResult(hash, isApproved, indexer) {
  const motion = await getLatestMotionByHash(hash);
  if (!motion || !isProposalMotion(motion.method)) {
    // it means this motion hash is not a treasury proposal motion hash
    return;
  }

  let name;
  if ("approveProposal" === motion.method) {
    name = isApproved ? "Approved" : ProposalEvents.Proposed;
  } else if ("rejectProposal" === motion.method) {
    if (!isApproved) {
      name = ProposalEvents.Proposed;
    } else if (indexer.blockHeight >= 1164233) {
      // There is no Rejected event emitted before 1164233 for Kusama
      return;
    } else {
      name = ProposalEvents.Rejected;
    }
  }

  const session = asyncLocalStorage.getStore();
  const proposalCol = await getProposalCollection();
  await proposalCol.findOneAndUpdate(
    { proposalIndex: motion.treasuryProposalId },
    {
      $set: { state: { name, indexer } },
    },
    { session }
  );
}

module.exports = {
  handleProposedForProposal,
  updateProposalStateByProposeOrVote,
  updateProposalStateByVoteResult,
};
