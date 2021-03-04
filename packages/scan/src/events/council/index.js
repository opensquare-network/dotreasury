const { CouncilEvents, Modules } = require("../../utils/constants");
const { getMotionLatestIndex } = require("./utils");
const { getMotionCollection } = require("../../mongo");
const { motionActions } = require("./constants");
const { firstKnowCouncilCloseEventHeight } = require("../../block/known");
const { getMotionVoting, getMotionVotingByHeight } = require("./utils");
const {
  updateProposalStateByProposeOrVote,
  handleProposedForProposal,
  updateProposalStateByVoteResult,
} = require("./proposalMotion");
const {
  handleProposedForBounty,
  updateBountyByVoteResult,
} = require("./bountyMotion");

async function handleCouncilEvent(event, normalizedExtrinsic, extrinsic) {
  const { section, method } = event;
  if (Modules.Council !== section) {
    return false;
  }

  if (method === CouncilEvents.Proposed) {
    await handleProposedForProposal(event, normalizedExtrinsic, extrinsic);
    await handleProposedForBounty(event, normalizedExtrinsic, extrinsic);
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

  return true;
}

async function handleVoteEvent(event, normalizedExtrinsic) {
  const eventData = event.data.toJSON();
  const hash = eventData[1];
  const voting = await getMotionVoting(
    normalizedExtrinsic.extrinsicIndexer.blockHash,
    hash
  );

  const col = await getMotionCollection();
  const index = await getMotionLatestIndex(hash);
  await col.updateOne(
    { index },
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

  const indexer = normalizedExtrinsic.extrinsicIndexer;
  await updateProposalStateByProposeOrVote(hash, indexer);
}

async function handleClosedEvent(event, normalizedExtrinsic) {
  const eventData = event.data.toJSON();
  const hash = eventData[0];
  const voting = await getMotionVotingByHeight(
    normalizedExtrinsic.extrinsicIndexer.blockHeight - 1,
    hash
  );

  const col = await getMotionCollection();
  const index = await getMotionLatestIndex(hash);
  await col.updateOne(
    { index },
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
  const index = await getMotionLatestIndex(hash);
  await col.updateOne({ index }, updateObj);

  await updateProposalStateByVoteResult(
    hash,
    true,
    normalizedExtrinsic.extrinsicIndexer
  );
  await updateBountyByVoteResult(
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
  const index = await getMotionLatestIndex(hash);
  await col.updateOne({ index }, updateObj);

  await updateProposalStateByVoteResult(
    hash,
    false,
    normalizedExtrinsic.extrinsicIndexer
  );
  await updateBountyByVoteResult(
    hash,
    true,
    normalizedExtrinsic.extrinsicIndexer
  );
}

async function handleExecutedEvent(event) {
  const eventData = event.data.toJSON();
  const [hash, result] = eventData;

  const col = await getMotionCollection();
  const index = await getMotionLatestIndex(hash);
  await col.updateOne(
    { index },
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
