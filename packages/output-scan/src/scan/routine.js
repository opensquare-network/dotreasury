const last = require("lodash.last");
const { isUseMetaDb } = require("../env");
const { scanNormalizedBlock } = require("./block");
const { fetchBlocks } = require("./fetchBlocks");
const { logger } = require("../logger");
const { updateScanHeight } = require("../mongo/scanHeight");
const { updateSpecs } = require("../chain/specs");
const { getSpecHeights } = require("../chain/specs");
const { getScanStep } = require("../env");
const { sleep } = require("../utils/sleep");
const { getLatestHeight } = require("../chain/latestHead");
const { getNextScanHeight } = require("../mongo/scanHeight");
const { getBlockIndexer } = require("../block/getBlockIndexer");
const { tryCreateStatPoint } = require("../stats");

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

    if (isUseMetaDb()) {
      const specHeights = getSpecHeights();
      if (targetHeight > last(specHeights)) {
        await updateSpecs();
      }
    }

    const heights = [];
    for (let i = scanHeight; i <= targetHeight; i++) {
      heights.push(i)
    }

    const blocks = await fetchBlocks(heights);
    if ((blocks || []).length <= 0) {
      await sleep(1000);
      continue;
    }

    for (const block of blocks) {
      // TODO: do following operations in one transaction
      try {
        const blockIndexer = getBlockIndexer(block);
        await tryCreateStatPoint(blockIndexer);

        await scanNormalizedBlock(block.block, block.events);
        await updateScanHeight(block.height);

        if (block.height % 30000 === 0) {
          console.log(`${block.height} restart process in case of memory leak`);
          process.exit(0);
        }
      } catch (e) {
        await sleep(3000);
        logger.error(`Error with block scan ${ block.height }`, e);
      }
    }

    const lastHeight = last(blocks || []).height
    scanHeight = lastHeight + 1;
    logger.info(`${lastHeight} scan finished!`)
  }
}

module.exports = {
  beginRoutineScan,
}
