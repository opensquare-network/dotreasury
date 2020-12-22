const { getBountyStateCollection } = require("../../mongo");
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
    handleProposeBounty(args, indexer, events);
  } else if (name === "approveBounty") {
    handleApproveBounty(args, indexer, events);
  } else if (name === "proposeCurator") {
    handleProposeCurator(args, indexer, events);
  } else if (name === "unassignCurator") {
    handleUnassignCurator(args, indexer, events);
  } else if (name === "acceptCurator") {
    handleAcceptCurator(args, indexer, events);
  } else if (name === "awardBounty") {
    handleAwardBounty(args, indexer, events);
  } else if (name === "claimBounty") {
    handleClaimBounty(args, indexer, events);
  } else if (name === "closeBounty") {
    handleCloseBounty(args, indexer, events);
  } else if (name === "extendBountyExpiry") {
    handleExtendBountyExpiry(args, indexer, events);
  }
}

async function handleProposeBounty(args, indexer, events) {
  const { value, description } = args;
}

async function handleApproveBounty(args, indexer, events) {
  const { bounty_id: bountyIndex } = args;

  await saveBountyState(bountyIndex, "ApproveBounty", args, indexer);
}

async function handleProposeCurator(args, indexer, events) {
  const { bounty_id: bountyIndex, curator, fee } = args;

  await saveBountyState(bountyIndex, "ProposeCurator", args, indexer);
}

async function handleUnassignCurator(args, indexer, events) {
  const { bounty_id: bountyIndex } = args;

  await saveBountyState(bountyIndex, "UnassignCurator", args, indexer);
}

async function handleAcceptCurator(args, indexer, events) {
  const { bounty_id: bountyIndex } = args;

  await saveBountyState(bountyIndex, "AcceptCurator", args, indexer);
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

async function saveBountyState(bountyIndex, state, args, indexer, sort) {
  const api = await getApi();
  const meta = await api.query.treasury.bounties.at(
    indexer.blockHash,
    bountyIndex
  );

  const bountyStateCol = await getBountyStateCollection();
  await bountyStateCol.insertOne({
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
