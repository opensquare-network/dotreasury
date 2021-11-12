const { CHAINS, currentChain, } = require("../../../env");
const { getTreasurySlashCollection } = require("../../../mongo/data");
const {
  Modules,
  TreasuryProposalEvents,
} = require("../../common/constants")

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

async function handleProposalSlash(event, indexer, blockEvents) {
  if (CHAINS.KUSAMA === currentChain()) {
    const data = await handleKnown(event, indexer);
    if (data) {
      return data
    }
  }

  return handleUnknown(...arguments);
}

async function handleUnknown(event, indexer, blockEvents) {
  const sort = indexer.eventIndex;
  const nextEvent = blockEvents[sort + 1];
  const {
    event: { section, method, data, },
  } = nextEvent;
  if (section !== Modules.Treasury || method !== TreasuryProposalEvents.Rejected) {
    return;
  }

  const obj = {
    indexer,
    section: Modules.Treasury,
    method: TreasuryProposalEvents.Rejected,
    balance: event.data[0].toString(),
    proposalId: data[0].toJSON(),
  };

  const col = await getTreasurySlashCollection();
  await col.insertOne(obj);

  return obj;
}

async function handleKnown(event, indexer,) {
  const knownSlash = knownProposalSlash.find(item => item.block === indexer.blockHeight);
  if (!knownSlash) {
    return
  }

  const obj = {
    indexer,
    section: Modules.Treasury,
    method: TreasuryProposalEvents.Rejected,
    balance: event.data[0].toString(),
    proposalId: knownSlash.proposalId,
  };
  const col = await getTreasurySlashCollection()
  await col.insertOne(obj);
  return obj;
}

module.exports = {
  handleProposalSlash,
}
