const { getMotionCollection } = require("../mongo/data");

async function getMotionHeights() {
  const col = await getMotionCollection()
  const motions = await col.find({}).toArray()

  const heights = [];
  for (const motion of motions) {
    (motion.timeline || []).map(item => {
      if (item.indexer) {
        heights.push(item.indexer.blockHeight);
      } else if (item.extrinsic) {
        heights.push(item.extrinsic.extrinsicIndexer.blockHeight);
      }
    })
  }

  return [...new Set(heights)]
}

module.exports = {
  getMotionHeights,
}
