const { getProposalCollection } = require("../mongo/data");

async function getProposalHeights() {
  const col = await getProposalCollection()
  const proposals = await col.find({}).toArray()

  const heights = [];
  for (const proposal of proposals) {
    (proposal.timeline || []).map(item => {
      const indexer = item.indexer || item.extrinsicIndexer || item.eventIndexer;
      heights.push(indexer.blockHeight);
    })
  }

  return [...new Set(heights)]
}

module.exports = {
  getProposalHeights,
}
