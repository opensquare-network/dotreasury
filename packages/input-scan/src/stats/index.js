const { bnToBn } = require("@polkadot/util");
const { getWeeklyStatsCollection, getStatusCollection } = require("../mongo/data");
const { getNowIncomeSeats } = require("../mongo/scanHeight");
const { getTreasuryBalanceV2 } = require("../utils/freeBalance");

const lastStatsHeight = "last-incomestats-height";

const weeklyBlocks = 3600*24*7 / 6;

async function getNextStatHeight() {
  const statusCol = await getStatusCollection();
  const heightInfo = await statusCol.findOne({ name: lastStatsHeight });

  if (!heightInfo) {
    return weeklyBlocks;
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

async function tryCreateStatPoint(indexer) {
  const nextStatHeight = await getNextStatHeight();

  if (indexer.blockHeight !== nextStatHeight) {
    return;
  }

  const income = await getNowIncomeSeats();
  const treasuryBalance = await getTreasuryBalanceV2(indexer.blockHash);

  // Go on create one stat point
  const weeklyStatsCol = await getWeeklyStatsCollection();
  await weeklyStatsCol.updateOne(
    { indexer },
    {
      $set: {
        income,
        treasuryBalance: bnToBn(treasuryBalance || 0).toString(),
      },
    },
    { upsert: true }
  );

  await updateStatHeight(indexer.blockHeight)
}

module.exports = {
  tryCreateStatPoint,
};
