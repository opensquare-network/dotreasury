const dotenv = require("dotenv");
dotenv.config();

const isNil = require("lodash.isnil");
const {
  getInputWeeklyStatsCollection,
  getOutputWeeklyStatsCollection,
} = require("../mongo");
const { getPrice } = require("@dotreasury/price/src/calcprice/price");

async function syncWeeklyPrice(weeklyStatsCol) {
  const items = await weeklyStatsCol.find().toArray();
  for (const item of items) {
    if (!isNil(item.price)) {
      continue;
    }
    const price = await getPrice(process.env.CHAIN, item.indexer.blockTime);
    await weeklyStatsCol.updateOne(
      { _id: item._id },
      {
        $set: {
          price,
        },
      },
    );
  }
}

async function main() {
  const outputWeeklyStats = await getOutputWeeklyStatsCollection();
  await syncWeeklyPrice(outputWeeklyStats);

  const inputWeeklyStats = await getInputWeeklyStatsCollection();
  await syncWeeklyPrice(inputWeeklyStats);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
