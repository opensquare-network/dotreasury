const { getBlockIndexerByHeight } = require("./chain");
const { stringUpperFirst } = require("@polkadot/util");
const {
  getStatusCollection,
  getProposalCollection,
  getBountyCollection,
  getTipCollection,
  getBurntCollection,
  getWeeklyStatsCollection,
} = require("../mongo");
const { utils: { bigAdd } } = require("@osn/scan-common");

const lastStatsHeight = "last-outputstats-height";

const oneHour = 3600;
const oneWeek = oneHour * 24 * 7;
const weeklyBlocks = oneWeek / 6;

async function getNextStatHeight() {
  const statusCol = await getStatusCollection();
  const heightInfo = await statusCol.findOne({ name: lastStatsHeight });

  if (!heightInfo) {
    return 1;
  } else if (typeof heightInfo.value === "number") {
    return heightInfo.value + weeklyBlocks;
  } else {
    console.error("Stat height value error in DB!");
    process.exit(1);
  }
}

async function updateStatHeight(height) {
  const statusCol = await getStatusCollection();
  await statusCol.findOneAndUpdate(
    { name: lastStatsHeight },
    { $set: { value: height } },
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
    ({ state: { name, state } }) => (name || state) === "Awarded"
  );
  const proposalSpent = spentProposals.reduce(
    (result, { value }) => bigAdd(result, value),
    0
  );

  const tipSpent = tips.reduce((result, { state: { state }, medianValue }) => {
    if (state !== "TipClosed") {
      return result;
    }

    if (!medianValue) {
      return result;
    }

    return bigAdd(result, medianValue);
  }, 0);

  const bountySpent = bounties.reduce((result, { meta: { status, value } }) => {
    const statusKey = stringUpperFirst(Object.keys(status)[0]);

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

async function tryCreateStatPoint(nextBlockIndexer) {
  while (true) {
    const nextStatHeight = await getNextStatHeight();

    if (nextBlockIndexer.blockHeight <= nextStatHeight) {
      return;
    }

    const indexer = await getBlockIndexerByHeight(nextStatHeight);
    const output = await calcOutputStats();

    // Go on create one stat point
    const weeklyStatsCol = await getWeeklyStatsCollection();
    await weeklyStatsCol.updateOne(
      { indexer },
      {
        $set: {
          output,
        },
      },
      { upsert: true }
    );

    await updateStatHeight(nextStatHeight)
  }
}

module.exports = {
  tryCreateStatPoint,
};
