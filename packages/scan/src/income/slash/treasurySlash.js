const {
  Modules,
  TreasuryEvent,
  TreasuryMethods,
} = require("../../utils/constants");

function handleTreasuryProposalSlash(
  event,
  sort,
  allBlockEvents,
  blockIndexer
) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1 || phase.isNull) {
    return;
  }

  const nextEvent = allBlockEvents[sort - 1];
  const {
    event: { section, method },
  } = nextEvent;
  if (section !== Modules.Treasury || method !== TreasuryEvent.Rejected) {
    return;
  }

  const treasuryRejectedEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];
  const data = {
    indexer: blockIndexer,
    section,
    method,
    balance,
    treasuryDepositEventData,
    treasuryRejectedEventData,
  };
}

function handleTreasuryBountyRejectedSlash(
  event,
  sort,
  allBlockEvents,
  blockIndexer
) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1 || phase.isNull) {
    return;
  }

  const nextEvent = allBlockEvents[sort - 1];
  const {
    event: { section, method },
  } = nextEvent;
  if (section !== Modules.Treasury || method !== TreasuryEvent.BountyRejected) {
    return;
  }

  const bountyRejectedEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];
  const data = {
    indexer: blockIndexer,
    section,
    method,
    balance,
    treasuryDepositEventData,
    bountyRejectedEventData,
  };
}

function handleTreasuryBountyUnassignCuratorSlash(
  event,
  sort,
  allBlockEvents,
  extrinsicIndexer,
  extrinsic
) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (phase.isNull) {
    return;
  }

  const meta = extrinsic.method.meta.toJSON();
  if (meta.name !== TreasuryMethods.unassignCurator) {
    return;
  }

  const treasuryDepositEventData = treasuryDepositData.toJSON();

  const bountyId = extrinsic.method.args[0].toJSON();
  const data = {
    extrinsicIndexer,
    section: extrinsic.method.section,
    method: meta.name,
    args: { bountyId },
    balance: (treasuryDepositEventData || [])[0],
  };
}

module.exports = {
  handleTreasuryProposalSlash,
  handleTreasuryBountyRejectedSlash,
  handleTreasuryBountyUnassignCuratorSlash,
};
