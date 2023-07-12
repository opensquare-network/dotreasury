const { getBlockIndexerByHeight } = require("./chain");
const {
  getStatusCollection,
  getWeeklyStatsCollection,
} = require("../mongo");
const { calcOutputStatsAt } = require("./output");
const {
  chain: { getLatestHeight },
} = require("@osn/scan-common");

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

async function createStatAt(indexer, isWeekPoint = true) {
  const output = await calcOutputStatsAt(indexer);

  const weeklyStatsCol = await getWeeklyStatsCollection();
  if (!isWeekPoint) {
    await weeklyStatsCol.deleteMany({ isWeekPoint: false });
  }

  await weeklyStatsCol.updateOne(
    { indexer: indexer },
    {
      $set: {
        isWeekPoint,
        output,
      },
    },
    { upsert: true }
  );

  await updateStatHeight(indexer.blockHeight)
}

async function tryCreateStatPoint(indexer) {
  let nextStatHeight = await getNextStatHeight();
  while (indexer.blockHeight > nextStatHeight) {
    const statIndexer = await getBlockIndexerByHeight(nextStatHeight);
    await createStatAt(statIndexer);
    nextStatHeight = await getNextStatHeight();
  }

  const chainHeight = getLatestHeight();
  if (indexer.blockHeight > chainHeight - 90 && indexer.blockHeight % 100 === 0) {
    await createStatAt(indexer, false);
  }
}

module.exports = {
  tryCreateStatPoint,
};
