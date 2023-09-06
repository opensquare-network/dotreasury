const { getOutTransferCollection } = require("../mongo/data");

async function getOutTransferHeights() {
  const col = await getOutTransferCollection();
  const records = await col.find({}).toArray();

  const heights = [];
  for (const record of records) {
    heights.push(record.indexer.blockHeight);
  }

  return [...new Set(heights)]
}

module.exports = {
  getOutTransferHeights,
}
