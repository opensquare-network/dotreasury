const { getScanStep } = require("../../env");
const { getHeightCollection } = require("../knownHeight");

async function getNextKnownHeights(beginHeight) {
  const step = getScanStep();
  const col = await getHeightCollection()
  const records = await col.find({
    height: { $gte: beginHeight },
  }).sort({ height: 1 }).limit(step).toArray();

  return (records || []).map(item => item.height);
}

module.exports = {
  getNextKnownHeights,
}
