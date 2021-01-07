const { getApi } = require("../../api");
const {
  CouncilEvents,
  Modules,
  ProposalMethods,
  ProposalEvents,
  BountyMethods,
} = require("../../utils/constants");
const { getCall } = require("../../utils/call");
const { getMotionCollection, getProposalCollection } = require("../../mongo");
const { motionActions } = require("./constants");
const {
  firstKnowCouncilCloseEventHeight,
} = require("../../block/knownCouncilEventBlocks");

async function handleCouncilEvent(event, normalizedExtrinsic, extrinsic) {
  const { section, method } = event;
  if (Modules.Council !== section) {
    return;
  }

  if (method === CouncilEvents.Proposed) {
    await handleProposed(event, normalizedExtrinsic, extrinsic);
  } else if (method === CouncilEvents.Voted) {
    await handleVoteEvent(event, normalizedExtrinsic);
  } else if (method === CouncilEvents.Approved) {
    await handleApprovedEvent(event, normalizedExtrinsic);
  } else if (method === CouncilEvents.Disapproved) {
    await handleDisapprovedEvent(event, normalizedExtrinsic);
  } else if (method === CouncilEvents.Executed) {
    await handleExecutedEvent(event);
  } else if (method === CouncilEvents.Closed) {
    await handleClosedEvent(event, normalizedExtrinsic);
  }
}

async function getMotionVoting(blockHash, motionHash) {
  const api = await getApi();
  const votingObject = await api.query.council.voting.at(blockHash, motionHash);
  return votingObject.toJSON();
}

async function getMotionVotingByHeight(height, motionHash) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  return await getMotionVoting(blockHash, motionHash);
}

async function extractCallIndexAndArgs(normalizedExtrinsic, extrinsic) {
  // TODO: handle proxy extrinsic
  const blockHash = normalizedExtrinsic.extrinsicIndexer.blockHash;
  const { section, name, args } = normalizedExtrinsic;
  if ("utility" === section && "asMulti" === name) {
    const {
      call: {
        args: {
          proposal: { args: proposalArgs },
        },
      },
    } = args;
    const call = await getCall(blockHash, extrinsic.method.args[3].toHex());
    return [call.section, call.method, proposalArgs];
  }

  const {
    args: {
      proposal: { args: proposalArgs },
    },
  } = normalizedExtrinsic;
  const call = await getCall(blockHash, extrinsic.args[1].toHex());
  return [call.section, call.method, proposalArgs];
}

async function handleProposed(event, normalizedExtrinsic, extrinsic) {
  const [section, method, args] = await extractCallIndexAndArgs(
    normalizedExtrinsic,
    extrinsic
  );
  if (section !== Modules.Treasury) {
    return;
  }

  if (
    ![
      ProposalMethods.approveProposal,
      ProposalMethods.rejectProposal,
      BountyMethods.approveBounty,
      BountyMethods.proposeCurator,
      BountyMethods.unassignCurator,
    ].includes(method)
  ) {
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
  if (!motion) {
    // it means this motion hash is not a treasury proposal motion hash
    return;
  }

  const motionState = motion.state;
  const motionVoting = motion.voting;
  const name =
    motion.method === "approveProposal" ? "ApproveVoting" : "RejectVoting";

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

async function handleVoteEvent(event, normalizedExtrinsic) {
  const eventData = event.data.toJSON();
  const hash = eventData[1];
  const voting = await getMotionVoting(
    normalizedExtrinsic.extrinsicIndexer.blockHash,
    hash
  );

  const col = await getMotionCollection();
  await col.updateOne(
    { hash },
    {
      $set: {
        voting,
        state: {
          state: CouncilEvents.Voted,
          eventData,
          extrinsic: normalizedExtrinsic,
        },
      },
      $push: {
        timeline: {
          action: motionActions.Vote,
          eventData,
          extrinsic: normalizedExtrinsic,
        },
      },
    }
  );

  await updateProposalStateByProposeOrVote(
    hash,
    normalizedExtrinsic.extrinsicIndexer
  );
}

async function handleClosedEvent(event, normalizedExtrinsic) {
  const eventData = event.data.toJSON();
  const hash = eventData[0];
  const voting = await getMotionVotingByHeight(
    normalizedExtrinsic.extrinsicIndexer.blockHeight - 1,
    hash
  );

  const col = await getMotionCollection();
  await col.updateOne(
    { hash },
    {
      $set: {
        voting,
        state: {
          state: CouncilEvents.Closed,
          eventData,
          extrinsic: normalizedExtrinsic,
        },
      },
      $push: {
        timeline: {
          action: motionActions.Close,
          eventData,
          extrinsic: normalizedExtrinsic,
        },
      },
    }
  );
}

async function updateProposalStateByVoteResult(hash, isApproved, indexer) {
  const col = await getMotionCollection();
  const motion = await col.findOne({ hash });
  if (!motion) {
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

async function handleApprovedEvent(event, normalizedExtrinsic) {
  const eventData = event.data.toJSON();
  const hash = eventData[0];
  const voting = await getMotionVotingByHeight(
    normalizedExtrinsic.extrinsicIndexer.blockHeight - 1,
    hash
  );

  let updateObj;
  // We will insert timeline with Closed event handling when >= firstKnowCouncilCloseEventHeight
  if (
    normalizedExtrinsic.extrinsicIndexer.blockHeight <
    firstKnowCouncilCloseEventHeight
  ) {
    updateObj = {
      $set: {
        voting,
        result: CouncilEvents.Approved,
        state: {
          state: CouncilEvents.Closed,
          event: {
            name: CouncilEvents.Approved,
            data: eventData,
          },
          extrinsic: normalizedExtrinsic,
        },
      },
      $push: {
        timeline: {
          action: motionActions.Close,
          eventData,
          extrinsic: normalizedExtrinsic,
        },
      },
    };
  } else {
    updateObj = {
      $set: { voting, result: CouncilEvents.Approved },
    };
  }

  const col = await getMotionCollection();
  await col.updateOne({ hash }, updateObj);

  await updateProposalStateByVoteResult(
    hash,
    true,
    normalizedExtrinsic.extrinsicIndexer
  );
}

async function handleDisapprovedEvent(event, normalizedExtrinsic) {
  const eventData = event.data.toJSON();
  const hash = eventData[0];
  const voting = await getMotionVotingByHeight(
    normalizedExtrinsic.extrinsicIndexer.blockHeight - 1,
    hash
  );

  let updateObj;
  // We will insert timeline with Closed event handling when >= firstKnowCouncilCloseEventHeight
  if (
    normalizedExtrinsic.extrinsicIndexer.blockHeight <
    firstKnowCouncilCloseEventHeight
  ) {
    updateObj = {
      $set: {
        voting,
        result: CouncilEvents.Disapproved,
        state: {
          state: CouncilEvents.Closed,
          event: {
            name: CouncilEvents.Disapproved,
            data: eventData,
          },
          extrinsic: normalizedExtrinsic,
        },
      },
      $push: {
        timeline: {
          action: motionActions.Close,
          eventData,
          extrinsic: normalizedExtrinsic,
        },
      },
    };
  } else {
    updateObj = {
      $set: { voting, result: CouncilEvents.Disapproved },
    };
  }

  const col = await getMotionCollection();
  await col.updateOne({ hash }, updateObj);

  await updateProposalStateByVoteResult(
    hash,
    false,
    normalizedExtrinsic.extrinsicIndexer
  );
}

async function handleExecutedEvent(event) {
  const eventData = event.data.toJSON();
  const [hash, result] = eventData;

  const col = await getMotionCollection();
  await col.updateOne(
    { hash },
    {
      $set: {
        executed: {
          result,
          eventData,
        },
      },
    }
  );
}

module.exports = {
  handleCouncilEvent,
};
