const last = require("lodash.last");
const { scanBlockFromDb } = require("./block");
const { logger } = require("../logger");
const { updateScanHeight } = require("../mongo/scanHeight");
const { getBlocks } = require("../mongo/meta");
const { updateSpecs } = require("../chain/specs");
const { getSpecHeights } = require("../chain/specs");
const { getScanStep } = require("../env");
const { sleep } = require("../utils/sleep");
const { getLatestHeight } = require("../chain/latestHead");
const { getNextScanHeight } = require("../mongo/scanHeight");

async function beginRoutineScan() {
  let scanHeight = await getNextScanHeight();
  while (true) {
    const chainHeight = getLatestHeight();
    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(3000);
      continue;
    }

    let targetHeight = chainHeight;
    const step = getScanStep();
    if (scanHeight + step < chainHeight) {
      targetHeight = scanHeight + step;
    }

    const specHeights = getSpecHeights();
    if (targetHeight > last(specHeights)) {
      await updateSpecs();
    }

    const blocks = await getBlocks(scanHeight, targetHeight);
    if ((blocks || []).length <= 0) {
      await sleep(1000);
      continue;
    }

    for (const block of blocks) {
      // TODO: do following operations in one transaction
      try {
        await scanBlockFromDb(block);
        await updateScanHeight(block.height);
      } catch (e) {
        await sleep(3000);
        logger.error(`Error with block scan ${ block.height }`, e);
      }
    }

    const lastHeight = last(blocks).height
    logger.info(`${lastHeight} scan finished!`)
  }
}

module.exports = {
  beginRoutineScan,
}
