const { getMotionCollection, getProposalCollection } = require("../../mongo");
const {
  isProposalMotion,
  getMotionVoting,
  extractCallIndexAndArgs,
} = require("./utils");
const { motionActions } = require("./constants");
const {
  Modules,
  CouncilEvents,
  ProposalEvents,
  ProposalMethods,
} = require("../../utils/constants");

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

  const col = await getMotionCollection();
  await col.insertOne({
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
  });

  await updateProposalStateByProposeOrVote(
    hash,
    normalizedExtrinsic.extrinsicIndexer
  );
}

async function updateProposalStateByProposeOrVote(hash, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash });
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
    }
  );
}

async function updateProposalStateByVoteResult(hash, isApproved, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash });
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

  const proposalCol = await getProposalCollection();
  await proposalCol.findOneAndUpdate(
    { proposalIndex: motion.treasuryProposalId },
    {
      $set: { state: { name, indexer } },
    }
  );
}

module.exports = {
  handleProposedForProposal,
  updateProposalStateByProposeOrVote,
  updateProposalStateByVoteResult,
};
