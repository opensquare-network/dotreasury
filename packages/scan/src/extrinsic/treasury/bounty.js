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

async function handleProposeBounty(args, indexer, events) {}

async function handleApproveBounty(args, indexer, events) {}

async function handleProposeCurator(args, indexer, events) {}

async function handleUnassignCurator(args, indexer, events) {}

async function handleAcceptCurator(args, indexer, events) {}

async function handleAwardBounty(args, indexer, events) {}

async function handleClaimBounty(args, indexer, events) {}

async function handleCloseBounty(args, indexer, events) {}

async function handleExtendBountyExpiry(args, indexer, events) {}

module.exports = {
  handleBountyExtrinsic,
};
