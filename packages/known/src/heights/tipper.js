const { getTipperCollection } = require("../mongo/data");

async function getTipHeights() {
  const col = await getTipperCollection();
  const records = await col.find({}).toArray();

  const heights = [];
  for (const item of records) {
    heights.push(item.indexer.blockHeight);
  }

  return [...new Set(heights)]
}

module.exports = {
  getTipHeights,
}
