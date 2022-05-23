const { getChildBountyCollection } = require("../mongo/data");

async function getChildBountyHeights() {
  const col = await getChildBountyCollection();
  const records = await col.find({}).toArray();

  const heights = [];
  for (const record of records) {
    (record.timeline || []).map(item => {
      const indexer = item.indexer || item.extrinsicIndexer || item.eventIndexer;
      heights.push(indexer.blockHeight);
    })
  }

  return [...new Set(heights)]
}

module.exports = {
  getChildBountyHeights,
}
