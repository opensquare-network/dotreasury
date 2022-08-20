const { handleBlock } = require("./block");
const { getNextScanHeight } = require("../mongo/scanHeight");
const {
  env: { firstScanKnowHeights },
  scan: { oneStepScan, scanKnownHeights },
  utils: { sleep, getHeadUsedInGB, emptyFn },
} = require("@osn/scan-common");

async function beginScan() {
  if (firstScanKnowHeights()) {
    let scanHeight = await getNextScanHeight();
    await scanKnownHeights(scanHeight, emptyFn, handleBlock)
  }

  let scanHeight = await getNextScanHeight();
  while (true) {
    scanHeight = await oneStepScan(scanHeight, handleBlock);
    await sleep(0);

    if (getHeadUsedInGB() > 1) {
      console.log(
        `${ getHeadUsedInGB() }GB heap used, restart process in case of memory leak`
      );
      process.exit(0);
    }
  }
}

module.exports = {
  beginScan,
}
