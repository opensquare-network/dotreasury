const { beginRoutineScan } = require("./routine");
const { scanKnownHeights } = require("./known");
const { env: { firstScanKnowHeights } } = require("@dotreasury/common");

async function beginScan() {
  if (firstScanKnowHeights()) {
    await scanKnownHeights()
  }

  await beginRoutineScan();
}

module.exports = {
  beginScan,
}
