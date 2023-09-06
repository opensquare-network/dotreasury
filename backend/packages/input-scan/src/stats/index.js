const { bnToBn } = require("@polkadot/util");
const { getWeeklyStatsCollection } = require("../mongo/data");
const { getNowIncomeSeats } = require("../mongo/scanHeight");
const { getTreasuryBalanceV2 } = require("../utils/freeBalance");
const {
  chain: { getLatestHeight },
} = require("@osn/scan-common");

const weeklyBlocks = 3600 * 24 * 7 / 6;

async function createStatAt(indexer, isWeekPoint = true) {
  const income = await getNowIncomeSeats();
  const treasuryBalance = await getTreasuryBalanceV2(indexer.blockHash);

  const weeklyStatsCol = await getWeeklyStatsCollection();
  if (!isWeekPoint) {
    await weeklyStatsCol.deleteMany({ isWeekPoint: false });
  }

  // Go on create one stat point
  await weeklyStatsCol.updateOne(
    { indexer },
    {
      $set: {
        isWeekPoint,
        income,
        treasuryBalance: bnToBn(treasuryBalance || 0).toString(),
      },
    },
    { upsert: true }
  );
}

async function tryCreateStatPoint(indexer) {
  if (indexer.blockHeight % weeklyBlocks === 1) {
    await createStatAt(indexer, true);
    return;
  }

  const chainHeight = getLatestHeight();
  if (indexer.blockHeight > chainHeight - 90 && indexer.blockHeight % 100 === 0) {
    await createStatAt(indexer, false);
  }
}

module.exports = {
  tryCreateStatPoint,
};
