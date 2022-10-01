const { getMotionVoterCollection } = require("../mongo/data");

async function getMotionVoterHeights() {
  const col = await getMotionVoterCollection();
  const motionVoters = await col.find({}).toArray();

  const heights = [];
  for (const item of motionVoters) {
    heights.push(item.indexer.blockHeight);
  }

  return [...new Set(heights)]
}

module.exports = {
  getMotionVoterHeights,
}
