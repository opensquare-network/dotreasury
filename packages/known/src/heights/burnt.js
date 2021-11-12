const { getBurntCollection } = require("../mongo/data");

async function getBurntHeights() {
  const col = await getBurntCollection();
  const records = await col.find({}).toArray();

  const heights = [];
  for (const record of records) {
    heights.push(record.indexer.blockHeight);
  }

  return [...new Set(heights)]
}

module.exports = {
  getBurntHeights,
}
