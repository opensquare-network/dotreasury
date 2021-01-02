const { CouncilEvents, Modules } = require("../../utils/constants");
const { saveTimeline } = require("../../store/council");

async function handleCouncilEvent(event, normalizedExtrinsic) {
  const { section, method, data } = event;
  if (Modules.Council !== section) {
    return;
  }

  if (method === CouncilEvents.Proposed) {
    await handleProposed(event, normalizedExtrinsic);
  }

  const eventData = data.toJSON();
  // await handleVoteEvent(method, jsonData, indexer, eventSort);
  // await handleApprovedEvent(method, jsonData, indexer, eventSort);
  // await handleDisapprovedEvent(method, jsonData, indexer, eventSort);
  // await handleExecutedEvent(method, jsonData, indexer, eventSort);
}

async function handleProposed(event, normalizedExtrinsic) {
  console.log(event);
  console.log(normalizedExtrinsic);
}

async function handleVoteEvent(method, jsonData, indexer, eventSort) {
  if (method !== CouncilEvents.Voted) {
    return;
  }

  const [account, proposalHash, voted, yes, no] = jsonData;

  await saveTimeline(
    proposalHash,
    "CouncilVoted",
    { account, proposalHash, voted, yes, no },
    indexer
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
