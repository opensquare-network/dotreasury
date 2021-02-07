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
  if (
    extrinsic.method.section !== Modules.Treasury ||
    meta.name !== TreasuryMethods.unassignCurator
  ) {
    return;
  }

  const bountyIndex = extrinsic.method.args[0].toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();

  const data = {
    extrinsicIndexer,
    section: extrinsic.method.section,
    method: meta.name,
    balance: (treasuryDepositEventData || [])[0],
    bountyIndex,
  };
}

module.exports = {
  handleTreasuryProposalSlash,
  handleTreasuryBountyRejectedSlash,
  handleTreasuryBountyUnassignCuratorSlash,
};
