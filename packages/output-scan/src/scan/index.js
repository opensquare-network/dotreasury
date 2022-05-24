const { beginRoutineScan } = require("./routine");
const { scanKnownHeights } = require("./known");
const { env: { firstScanKnowHeights } } = require("@osn/scan-common");

async function beginScan() {
  if (firstScanKnowHeights()) {
    await scanKnownHeights()
  }

  await beginRoutineScan();
}

module.exports = {
  beginScan,
}
