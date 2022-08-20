const { getNextScanHeight } = require("../mongo/scanHeight");

async function scanKnownHeights() {
  const toScanHeight = await getNextScanHeight();
  let heights = await getNextKnownHeights(toScanHeight);
}
