const { handleBlock } = require("./block");
const {
  scan: { oneStepScan, scanKnownHeights },
  utils: { sleep, emptyFn },
  env: {
    firstScanKnowHeights,
  }
} = require("@osn/scan-common");
const { getNextScanHeight } = require("../mongo/scanHeight");

async function beginScan() {
  let scanHeight = await getNextScanHeight();
  if (firstScanKnowHeights()) {
    await scanKnownHeights(scanHeight, emptyFn, handleBlock);
  }

  scanHeight = await getNextScanHeight();
  while (true) {
    scanHeight = await oneStepScan(scanHeight, handleBlock);
    await sleep(0);
  }
}

module.exports = {
  beginScan,
}
