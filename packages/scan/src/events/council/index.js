const { getApi } = require("../../api");
const {
  CouncilEvents,
  Modules,
  ProposalMethods,
} = require("../../utils/constants");
const { saveTimeline } = require("../../store/council");
const {
  treasuryProposalCouncilIndexes,
  approveProposalIndex,
} = require("../../utils/call");
const { getMotionCollection } = require("../../mongo");
const { motionActions } = require("./constants");

async function handleCouncilEvent(event, normalizedExtrinsic, extrinsic) {
  const { section, method } = event;
  if (Modules.Council !== section) {
    return;
  }

  if (method === CouncilEvents.Proposed) {
    await handleProposed(event, normalizedExtrinsic);
  } else if (method === CouncilEvents.Voted) {
    await handleVoteEvent(event, normalizedExtrinsic);
  } else if (method === CouncilEvents.Closed) {
    await handleClosedEvent(event, normalizedExtrinsic);
  }
}

async function getMotionVoting(blockHash, motionHash) {
  const api = await getApi();
  const votingObject = await api.query.council.voting.at(blockHash, motionHash);
  return votingObject.toJSON();
}

function extractCallIndexAndArgs(normalizedExtrinsic) {
  // TODO: handle proxy extrinsic
  const { section, name, args } = normalizedExtrinsic;
  if ("utility" === section && "asMulti" === name) {
    const {
      call: {
        args: {
          proposal: { callIndex, args: proposalArgs },
        },
      },
    } = args;
    return [callIndex, proposalArgs];
  } else {
    const {
      args: {
        proposal: { callIndex, args },
      },
    } = normalizedExtrinsic;
    return [callIndex, args];
  }
}

async function handleProposed(event, normalizedExtrinsic) {
  const [callIndex, args] = extractCallIndexAndArgs(normalizedExtrinsic);
  if (!treasuryProposalCouncilIndexes.includes(callIndex)) {
    return;
  }

  const { proposal_id: treasuryProposalId } = args;
  const method =
    approveProposalIndex === callIndex
      ? ProposalMethods.approveProposal
      : ProposalMethods.rejectProposal;
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
}

async function handleClosedEvent(event, normalizedExtrinsic) {
  const eventData = event.data.toJSON();
  const hash = eventData[0];
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

async function handleApprovedEvent(method, jsonData, indexer, eventSort) {
  if (method !== CouncilEvents.Approved) {
    return;
  }

  const [proposalHash] = jsonData;

  await saveTimeline(
    proposalHash,
    "CouncilApproved",
    { proposalHash },
    indexer
  );
}

async function handleDisapprovedEvent(method, jsonData, indexer, eventSort) {
  if (method !== CouncilEvents.Disapproved) {
    return;
  }

  const [proposalHash] = jsonData;

  await saveTimeline(
    proposalHash,
    "CouncilDisapproved",
    { proposalHash },
    indexer
  );
}

async function handleExecutedEvent(method, jsonData, indexer, eventSort) {
  if (method !== CouncilEvents.Executed) {
    return;
  }

  const [proposalHash, result] = jsonData;

  await saveTimeline(
    proposalHash,
    "CouncilExecuted",
    { proposalHash, result },
    indexer
  );
}

module.exports = {
  handleCouncilEvent,
};
