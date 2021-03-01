const dayjs = require("dayjs");
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

module.exports = {
  processStat,
};
