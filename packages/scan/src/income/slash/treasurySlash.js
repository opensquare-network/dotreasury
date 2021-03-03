const {
  Modules,
  TreasuryEvent,
  TreasuryMethods,
  ksmTreasuryRefactorApplyHeight,
  TipEvents,
} = require("../../utils/constants");
const { treasurySlashLogger } = require("../../utils/logger");
const { getTreasurySlashCollection } = require("../../mongo");
const { asyncLocalStorage } = require("../../utils");

function isBountyModule(section, height) {
  if (height < ksmTreasuryRefactorApplyHeight && section === Modules.Treasury) {
    return true;
  }

  return (
    height >= ksmTreasuryRefactorApplyHeight && section === Modules.Bounties
  );
}

const knownProposalSlash = [
  {
    block: 280582,
    sort: 5,
    proposalId: 1,
  },
  {
    block: 280587,
    sort: 5,
    proposalId: 2,
  },
  {
    block: 280589,
    sort: 5,
    proposalId: 3,
  },
  {
    block: 281304,
    sort: 5,
    proposalId: 4,
  },
  {
    block: 294461,
    sort: 5,
    proposalId: 6,
  },
  {
    block: 294463,
    sort: 5,
    proposalId: 7,
  },
  {
    block: 294465,
    sort: 5,
    proposalId: 8,
  },
  {
    block: 294467,
    sort: 5,
    proposalId: 9,
  },
  {
    block: 305563,
    sort: 5,
    proposalId: 10,
  },
];

async function saveSlashRecord(data) {
  const session = asyncLocalStorage.getStore();
  const col = await getTreasurySlashCollection();
  await col.insertOne(data, { session });
}

async function handleTreasuryProposalSlash(
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
  const knownSlash = knownProposalSlash.find(
    (s) => s.block === blockIndexer.blockHeight && s.sort === sort
  );

  if (knownSlash) {
    const data = {
      indexer: blockIndexer,
      eventSort: sort,
      section: Modules.Treasury,
      method: TreasuryEvent.Rejected,
      balance,
      treasuryDepositEventData,
      proposalId: knownSlash.proposalId,
    };

    await saveSlashRecord(data);

    treasurySlashLogger.info(blockIndexer.blockHeight, TreasuryEvent.Rejected);
    return data;
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
    eventSort: sort + 1,
    section,
    method,
    balance,
    proposalId: treasuryRejectedEventData[0],
    treasuryDepositEventData,
    treasuryRejectedEventData,
  };
  await saveSlashRecord(data);
  treasurySlashLogger.info(blockIndexer.blockHeight, method);

  return data;
}

async function handleTipSlash(event, sort, allBlockEvents, blockIndexer) {
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
  if (section !== Modules.Tips || method !== TipEvents.TipSlashed) {
    return;
  }

  const tipSlashedEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];
  const data = {
    indexer: blockIndexer,
    eventSort: sort + 1,
    section,
    method,
    balance,
    treasuryDepositEventData,
    tipSlashedEventData,
  };

  await saveSlashRecord(data);
  treasurySlashLogger.info(blockIndexer.blockHeight, method);

  return data;
}

async function handleTreasuryBountyRejectedSlash(
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
  if (
    !isBountyModule(section, blockIndexer.blockHeight) ||
    method !== TreasuryEvent.BountyRejected
  ) {
    return;
  }

  const bountyRejectedEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];
  const data = {
    indexer: blockIndexer,
    eventSort: sort + 1,
    section,
    method,
    balance,
    bountyIndex: bountyRejectedEventData[0],
    treasuryDepositEventData,
    bountyRejectedEventData,
  };
  await saveSlashRecord(data);
  treasurySlashLogger.info(blockIndexer.blockHeight, method);

  return data;
}

async function handleTreasuryBountyUnassignCuratorSlash(
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
    !isBountyModule(extrinsic.method.section, extrinsicIndexer.blockHeight) ||
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
  await saveSlashRecord(data);
  treasurySlashLogger.info(extrinsicIndexer.blockHeight, meta.name);

  return data;
}

module.exports = {
  handleTreasuryProposalSlash,
  handleTreasuryBountyRejectedSlash,
  handleTreasuryBountyUnassignCuratorSlash,
  handleTipSlash,
};
