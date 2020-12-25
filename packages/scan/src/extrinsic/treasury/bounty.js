const { saveBountyTimeline } = require("../../store/bounty");
const { BountyMethods, Modules } = require("../../utils/constants");

async function handleBountyExtrinsic(
  section,
  name,
  args,
  isSuccess,
  indexer,
  events
) {
  if (section !== Modules.Treasury) {
    return;
  }

  if (!isSuccess) {
    return;
  }

  // Bounty methods
  if (name === BountyMethods.approveBounty) {
    await handleApproveBounty(args, indexer, events);
  } else if (name === BountyMethods.proposeCurator) {
    await handleProposeCurator(args, indexer, events);
  } else if (name === BountyMethods.unassignCurator) {
    await handleUnassignCurator(args, indexer, events);
  } else if (name === BountyMethods.acceptCurator) {
    await handleAcceptCurator(args, indexer, events);
  }
}

async function handleApproveBounty(args, indexer, events) {
  const { bounty_id: bountyIndex } = args;

  await saveBountyTimeline(
    bountyIndex,
    BountyMethods.approveBounty,
    args,
    indexer
  );
}

async function handleProposeCurator(args, indexer, events) {
  const { bounty_id: bountyIndex, curator, fee } = args;

  await saveBountyTimeline(
    bountyIndex,
    BountyMethods.proposeCurator,
    args,
    indexer
  );
}

async function handleUnassignCurator(args, indexer, events) {
  const { bounty_id: bountyIndex } = args;

  await saveBountyTimeline(
    bountyIndex,
    BountyMethods.unassignCurator,
    args,
    indexer
  );
}

async function handleAcceptCurator(args, indexer, events) {
  const { bounty_id: bountyIndex } = args;

  await saveBountyTimeline(
    bountyIndex,
    BountyMethods.acceptCurator,
    args,
    indexer
  );
}

module.exports = {
  handleBountyExtrinsic,
};
