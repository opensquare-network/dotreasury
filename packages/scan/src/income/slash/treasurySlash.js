const {
  Modules,
  TreasuryEvent,
  TreasuryMethods,
} = require("../../utils/constants");
const { incomeLogger } = require("../../utils");

const knownProposalSlash = [
  {
    block: 280582,
    sort: 5,
  },
  {
    block: 280587,
    sort: 5,
  },
  {
    block: 280589,
    sort: 5,
  },
  {
    block: 281304,
    sort: 5,
  },
  {
    block: 294461,
    sort: 5,
  },
  {
    block: 294463,
    sort: 5,
  },
  {
    block: 294465,
    sort: 5,
  },
  {
    block: 294465,
    sort: 5,
  },
  {
    block: 294467,
    sort: 5,
  },
  {
    block: 305563,
    sort: 5,
  },
  {
    block: 305563,
    sort: 5,
  },
];

function handleTreasuryProposalSlash(
  event,
  sort,
  allBlockEvents,
  blockIndexer
) {
  const {
    event: { data: treasuryDepositData },
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1) {
    return;
  }

  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];
  if (
    knownProposalSlash.find(
      (s) => s.block === blockIndexer.blockHeight && s.sort === sort
    )
  ) {
    return {
      indexer: blockIndexer,
      section: Modules.Treasury,
      method: TreasuryEvent.Rejected,
      balance,
      treasuryDepositEventData,
    };
  }

  const nextEvent = allBlockEvents[sort + 1];
  const {
    event: { section, method },
  } = nextEvent;
  if (section !== Modules.Treasury || method !== TreasuryEvent.Rejected) {
    return;
  }

  const treasuryRejectedEventData = nextEvent.event.data.toJSON();
  const data = {
    indexer: blockIndexer,
    section,
    method,
    balance,
    treasuryDepositEventData,
    treasuryRejectedEventData,
  };
  incomeLogger.info(`treasury proposal slash detected`, data);

  return data;
}

function handleTreasuryBountyRejectedSlash(
  event,
  sort,
  allBlockEvents,
  blockIndexer
) {
  const {
    event: { data: treasuryDepositData },
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1) {
    return;
  }

  const nextEvent = allBlockEvents[sort + 1];
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
  incomeLogger.info(`treasury bounty rejected slash detected`, data);

  return data;
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
  } = event; // get deposit event data
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
  incomeLogger.info(`treasury bounty unassign curator slash detected`, data);

  return data;
}

module.exports = {
  handleTreasuryProposalSlash,
  handleTreasuryBountyRejectedSlash,
  handleTreasuryBountyUnassignCuratorSlash,
};
