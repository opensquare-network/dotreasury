const { getNextScanHeight } = require("../mongo/scanHeight");
const { scanNormalizedBlock } = require("./block");
const { sleep } = require("../utils/sleep");
const { updateScanHeight } = require("../mongo/scanHeight");
const { getNextKnownHeights } = require("../mongo/service/known");
const { logger } = require("../logger");
const last = require("lodash.last");
const { fetchBlocks } = require("./fetchBlocks");
const { getBlockIndexer } = require("../block/getBlockIndexer");
const { tryCreateStatPoint } = require("../stats");

let count = 0;

async function scanKnownHeights() {
  const toScanHeight = await getNextScanHeight();
  let heights = await getNextKnownHeights(toScanHeight);
  while (heights.length > 0) {
    const blocks = await fetchBlocks(heights)
    for (const block of blocks) {
      try {
        const blockIndexer = getBlockIndexer(block.block);
        await tryCreateStatPoint(blockIndexer);

        await scanNormalizedBlock(block.block, block.events);
        await updateScanHeight(block.height);
      } catch (e) {
        await sleep(0);
        logger.error(`Error with block scan ${ block.height }`, e);
      }
    }

    const lastHeight = last(blocks || [])?.height
    logger.info(`${ lastHeight } scan finished! - known height scan`)

    count++
    if (count % 10 === 0) {
      console.log(`${ lastHeight } restart process in case of memory leak`);
      process.exit(0);
    }

    heights = await getNextKnownHeights(lastHeight + 1);
  }
}

module.exports = {
  scanKnownHeights,
}
