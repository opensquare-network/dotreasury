const { getHeightCollection } = require("../knownHeight");

async function getNextKnownHeights(beginHeight) {
  const col = await getHeightCollection()
  const records = await col.find({
    height: { $gte: beginHeight },
  }).sort({ height: 1 }).limit(1).toArray();

  return (records || []).map(item => item.height);
}

module.exports = {
  getNextKnownHeights,
}
