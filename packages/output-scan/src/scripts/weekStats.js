require("dotenv").config();

const { getOutputStatsAt } = require("../stats/calc");
const { getWeeklyStatsCollection } = require("../mongo");

(async () => {
  const weeklyStatsCol = await getWeeklyStatsCollection();
  const arr = await weeklyStatsCol.find({}).sort({ "indexer.blockHeight": 1 }).toArray();
  for (const { indexer } of arr) {
    const output = await getOutputStatsAt(indexer);
    await weeklyStatsCol.updateOne({ indexer: indexer }, { $set: { output } }, { upsert: true });

    console.log(`Week stats updated at ${ indexer.blockHeight }`);
  }

  process.exit(0);
})();
