const { getBountyTimelineCollection } = require("../../mongo");
const { getApi } = require("../../api");

async function handleBountyExtrinsic(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  if (section !== "treasury") {
    return;
  }

  if (!isSuccess) {
    return;
  }

  // Bounty methods
  if (name === "proposeBounty") {
    await handleProposeBounty(args, indexer, events);
  } else if (name === "approveBounty") {
    await handleApproveBounty(args, indexer, events);
  } else if (name === "proposeCurator") {
    await handleProposeCurator(args, indexer, events);
  } else if (name === "unassignCurator") {
    await handleUnassignCurator(args, indexer, events);
  } else if (name === "acceptCurator") {
    await handleAcceptCurator(args, indexer, events);
  } else if (name === "awardBounty") {
    await handleAwardBounty(args, indexer, events);
  } else if (name === "claimBounty") {
    await handleClaimBounty(args, indexer, events);
  } else if (name === "closeBounty") {
    await handleCloseBounty(args, indexer, events);
  } else if (name === "extendBountyExpiry") {
    await handleExtendBountyExpiry(args, indexer, events);
  }
}

async function handleProposeBounty(args, indexer, events) {
  const { value, description } = args;
}

async function handleApproveBounty(args, indexer, events) {
  const { bounty_id: bountyIndex } = args;

  await saveBountyTimeline(bountyIndex, "ApproveBounty", args, indexer);
}

async function handleProposeCurator(args, indexer, events) {
  const { bounty_id: bountyIndex, curator, fee } = args;

  await saveBountyTimeline(bountyIndex, "ProposeCurator", args, indexer);
}

async function handleUnassignCurator(args, indexer, events) {
  const { bounty_id: bountyIndex } = args;

  await saveBountyTimeline(bountyIndex, "UnassignCurator", args, indexer);
}

async function handleAcceptCurator(args, indexer, events) {
  const { bounty_id: bountyIndex } = args;

  await saveBountyTimeline(bountyIndex, "AcceptCurator", args, indexer);
}

async function handleAwardBounty(args, indexer, events) {
  const { bounty_id, beneficiary } = args;
}

async function handleClaimBounty(args, indexer, events) {
  const { bounty_id } = args;
}

async function handleCloseBounty(args, indexer, events) {
  const { bounty_id } = args;
}

async function handleExtendBountyExpiry(args, indexer, events) {
  const { bounty_id, remark } = args;
}

async function saveBountyTimeline(bountyIndex, state, args, indexer, sort) {
  const api = await getApi();
  const meta = await api.query.treasury.bounties.at(
    indexer.blockHash,
    bountyIndex
  );

  const bountyTimelineCol = await getBountyTimelineCollection();
  await bountyTimelineCol.insertOne({
    indexer,
    sort,
    bountyIndex,
    state,
    args,
    meta: meta.toJSON(),
  });
}

module.exports = {
  handleBountyExtrinsic,
};
