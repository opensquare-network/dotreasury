const dayjs = require("dayjs");
const { bnToBn } = require("@polkadot/util");
const { getLastStatTime } = require("../mongo/statTime");
const { getIncomeNextScanStatus } = require("../mongo/scanHeight");
const {
  getProposalCollection,
  getBountyCollection,
  getTipCollection,
  getBurntCollection,
  getStatsCollection,
} = require("../mongo");
const { bigAdd, getTreasuryBalance } = require("../utils");
const { updateLastStatTime } = require("../mongo/statTime");
const { asyncLocalStorage } = require("./utils");

async function shouldSaveStatHistory(blockIndexer) {
  if (
    1377831 <= blockIndexer.blockHeight &&
    blockIndexer.blockHeight < 1492896
  ) {
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

  await saveStats(blockIndexer);

  // Remember latest stat time
  await updateLastStatTime(blockIndexer.blockTime);
}

async function saveStats(indexer) {
  const output = await calcOutputStats();
  const { seats: income } = await getIncomeNextScanStatus();
  const treasuryBalance = await getTreasuryBalance(
    indexer.blockHash,
    indexer.blockHeight
  );

  const session = asyncLocalStorage.getStore();
  const statsCol = await getStatsCollection();
  await statsCol.updateOne(
    { indexer },
    {
      $set: {
        output,
        income,
        treasuryBalance: bnToBn(treasuryBalance).toString(),
      },
    },
    { upsert: true, session }
  );
}

async function calcOutputStats() {
  const session = asyncLocalStorage.getStore();

  const proposalCol = await getProposalCollection();
  const proposals = await proposalCol
    .find(
      {},
      { projection: { value: 1, beneficiary: 1, meta: 1, state: 1 }, session }
    )
    .toArray();

  const tipCol = await getTipCollection();
  const tips = await tipCol
    .find({}, { projection: { finder: 1, medianValue: 1, state: 1 }, session })
    .toArray();

  const bountyCol = await getBountyCollection();
  const bounties = await bountyCol
    .find({}, { projection: { meta: 1, state: 1 }, session })
    .toArray();

  const burntCol = await getBurntCollection();
  const burntList = await burntCol
    .find({}, { projection: { balance: 1 }, session })
    .toArray();

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

module.exports = {
  processStat,
};
