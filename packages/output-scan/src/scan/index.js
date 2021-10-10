const { beginRoutineScan } = require("./routine");
const { scanKnownHeights } = require("./known");
const { firstScanKnowHeights } = require("../env");

async function beginScan() {
  if (firstScanKnowHeights()) {
    await scanKnownHeights()
  }

  await beginRoutineScan();
}

module.exports = {
  beginScan,
}
