const dayjs = require("dayjs");
const { expandMetadata } = require("@polkadot/metadata");
const { bnToBn } = require("@polkadot/util");
const { getApi } = require("../api");
const { TreasuryAccount } = require("../utils/constants");
const { getLastStatTime } = require("../mongo/statTime");
const { getIncomeNextScanStatus } = require("../mongo/scanHeight");
const {
  getProposalCollection,
  getBountyCollection,
  getTipCollection,
  getBurntCollection,
  getStatsCollection,
} = require("../mongo");
const { bigAdd } = require("../utils");
const { updateLastStatTime } = require("../mongo/statTime");

async function shouldSaveStatHistory(blockIndexer) {
  if (1377831 <= blockIndexer.height && blockIndexer.height < 1492896) {
    // Skip due to we cannot get treasury balance correctly in these blocks
    return false;
  }

  // Should save stats history weekly
  const lastOutputStatTime = await getLastStatTime();
  if (lastOutputStatTime) {
    // Weekly stats
    const nextStatTime = dayjs(lastOutputStatTime)
      .add(7, "d")
      .toDate()
      .getTime();
    if (blockIndexer.blockTime < nextStatTime) {
      // skip
      return false;
    }
  }

  return true;
}

async function processStat(blockIndexer) {
  const shouldSave = await shouldSaveStatHistory(blockIndexer);
  if (!shouldSave) {
    return;
  }

  await saveOutputStat(blockIndexer);
  await saveIncomeStat(blockIndexer);
  await saveTreasuryBalance(blockIndexer);

  // Remember latest stat time
  await updateLastStatTime(blockIndexer.blockTime);
}

async function saveOutputStat(indexer) {
  const output = await calcOutputStats();
  const statsCol = await getStatsCollection();
  await statsCol.updateOne({ indexer }, { $set: { output } }, { upsert: true });
}

async function saveIncomeStat(indexer) {
  const { seats: income } = await getIncomeNextScanStatus();
  const statsCol = await getStatsCollection();
  await statsCol.updateOne({ indexer }, { $set: { income } }, { upsert: true });
}

async function saveTreasuryBalance(indexer) {
  const treasuryBalance = await getTreasuryBalance(
    indexer.blockHash,
    indexer.blockHeight
  );
  const statsCol = await getStatsCollection();
  await statsCol.updateOne(
    { indexer },
    {
      $set: {
        treasuryBalance: bnToBn(treasuryBalance).toString(),
      },
    },
    { upsert: true }
  );
}

async function calcOutputStats() {
  const proposalCol = await getProposalCollection();
  const proposals = await proposalCol
    .find({}, { value: 1, beneficiary: 1, meta: 1, state: 1 })
    .toArray();

  const tipCol = await getTipCollection();
  const tips = await tipCol
    .find({}, { finder: 1, medianValue: 1, state: 1 })
    .toArray();

  const bountyCol = await getBountyCollection();
  const bounties = await bountyCol.find({}, { meta: 1, state: 1 }).toArray();

  const burntCol = await getBurntCollection();
  const burntList = await burntCol.find({}, { balance: 1 }).toArray();

  const output = await calcOutput(proposals, tips, bounties, burntList);

  return output;
}

const bountyStatuses = [
  "Proposed",
  "Approved",
  "Funded",
  "CuratorProposed",
  "Active",
  "PendingPayout",
];

async function calcOutput(
  proposals = [],
  tips = [],
  bounties = [],
  burntList = []
) {
  const spentProposals = proposals.filter(
    ({ state: { name } }) => name === "Awarded"
  );
  const proposalSpent = spentProposals.reduce(
    (result, { value }) => bigAdd(result, value),
    0
  );

  const tipSpent = tips.reduce((result, { state: { state }, medianValue }) => {
    if (state !== "TipClosed") {
      return result;
    }

    return bigAdd(result, medianValue);
  }, 0);

  const bountySpent = bounties.reduce((result, { meta: { status, value } }) => {
    const statusKey = Object.keys(status)[0];

    const index = bountyStatuses.findIndex((item) => item === statusKey);
    return index >= 2 ? bigAdd(result, value) : result;
  }, 0);

  const burntTotal = burntList.reduce((result, { balance }) => {
    return bigAdd(result, balance);
  }, 0);

  return {
    proposal: proposalSpent,
    tip: tipSpent,
    bounty: bountySpent,
    burnt: burntTotal,
  };
}

async function queryAccountFreeWithSystem(blockHash) {
  const api = await getApi();
  const account = (
    await api.query.system.account.at(blockHash, TreasuryAccount)
  ).toJSON();
  return account?.data?.free;
}

async function getOldKey(api) {
  const blockHash = await api.rpc.chain.getBlockHash(1375085);

  const metadata = await api.rpc.state.getMetadata(blockHash);
  const decorated = expandMetadata(metadata.registry, metadata);

  return [decorated.query.balances.freeBalance, TreasuryAccount];
}

async function getTreasuryBalance(blockHash, blockHeight) {
  const ksmMigrateAccountHeight = 1492896;

  const api = await getApi();
  if (blockHeight < 1375086) {
    const metadata = await api.rpc.state.getMetadata(blockHash);
    const decorated = expandMetadata(metadata.registry, metadata);
    const key = [decorated.query.balances.freeBalance, TreasuryAccount];
    const value = await api.rpc.state.getStorage(key, blockHash);

    return metadata.registry.createType("Compact<Balance>", value).toJSON();
  } else if (blockHeight < 1377831) {
    const oldKey = await getOldKey(api);
    const value = await api.rpc.state.getStorage(oldKey, blockHash);

    const metadata = await api.rpc.state.getMetadata(blockHash);
    return metadata.registry.createType("Compact<Balance>", value).toJSON();
  } else if (blockHeight < ksmMigrateAccountHeight) {
    // TODO: find how to get the balance from 1377831 to 1492896
    return await queryAccountFreeWithSystem(blockHash);
  } else {
    return await queryAccountFreeWithSystem(blockHash);
  }
}

module.exports = {
  processStat,
};
