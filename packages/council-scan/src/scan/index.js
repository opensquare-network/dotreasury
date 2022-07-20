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
    // todo: scan known heights
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
