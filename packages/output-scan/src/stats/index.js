const { getBlockIndexerByHeight } = require("./chain");
const {
  getStatusCollection,
  getWeeklyStatsCollection,
} = require("../mongo");
const { calcOutputStatsAt } = require("./output");

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

async function tryCreateStatPoint(blockIndexer) {
  while (true) {
    const nextStatHeight = await getNextStatHeight();
    if (nextStatHeight > blockIndexer.blockHeight) {
      return;
    }

    const statIndexer = await getBlockIndexerByHeight(nextStatHeight);
    const output = await calcOutputStatsAt(statIndexer);

    // Go on create one stat point
    const weeklyStatsCol = await getWeeklyStatsCollection();
    await weeklyStatsCol.updateOne(
      { indexer: statIndexer },
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
