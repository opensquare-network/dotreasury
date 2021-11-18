const { bnToBn } = require("@polkadot/util");
const { getWeeklyStatsCollection } = require("../mongo/data");
const { getNowIncomeSeats } = require("../mongo/scanHeight");
const { getTreasuryBalanceV2 } = require("../utils/freeBalance");

const weeklyBlocks = 3600*24*7 / 6;

async function tryCreateStatPoint(indexer) {

  if (indexer.blockHeight % weeklyBlocks !== 1) {
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
}

module.exports = {
  tryCreateStatPoint,
};
