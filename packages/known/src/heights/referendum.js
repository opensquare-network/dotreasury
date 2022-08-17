const { getDemocracyReferendumCollection } = require("../mongo/data");

async function getReferendumHeights() {
  const col = await getDemocracyReferendumCollection();
  const referenda = await col.find({}).toArray()

  const heights = [];
  for (const referendum of referenda) {
    (referendum.timeline || []).map(item => {
      const indexer = item.indexer || item.extrinsicIndexer || item.eventIndexer;
      heights.push(indexer.blockHeight);
    })
  }

  return [...new Set(heights)]
}

module.exports = {
  getReferendumHeights,
}
