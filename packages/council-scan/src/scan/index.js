const { scanKnownHeights } = require("./known");
const { handleBlock } = require("./block");
const {
  scan: { oneStepScan },
  utils: { sleep },
  env: {
    firstScanKnowHeights,
  }
} = require("@osn/scan-common");
const { getNextScanHeight } = require("../mongo/scanHeight");

async function beginScan() {
  if (firstScanKnowHeights()) {
    await scanKnownHeights();
  }

  let scanHeight = await getNextScanHeight();
  while (true) {
    scanHeight = await oneStepScan(scanHeight, handleBlock);
    await sleep(0);
  }
}

module.exports = {
  beginScan,
}
