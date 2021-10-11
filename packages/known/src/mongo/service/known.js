const { getHeightCollection } = require("../knownHeight");

async function saveKnownHeights(heights = []) {
  if (heights.length <= 0) {
    return
  }

  const col = await getHeightCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const height of heights) {
    bulk.find({ height }).upsert().updateOne({ $set: { height } });
  }

  await bulk.execute();
}

module.exports = {
  saveKnownHeights,
}
