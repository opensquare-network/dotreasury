const { getNextScanHeight } = require("../mongo/scanHeight");
const { scanNormalizedBlock } = require("./block");
const { sleep } = require("../utils/sleep");
const { updateScanHeight } = require("../mongo/scanHeight");
const { getNextKnownHeights } = require("../mongo/service/known");
const { logger } = require("../logger");
const last = require("lodash.last");
const { fetchBlocks } = require("./fetchBlocks");

async function scanKnownHeights() {
  const toScanHeight = await getNextScanHeight();
  let heights = await getNextKnownHeights(toScanHeight);
  while (heights.length > 0) {
    const blocks = await fetchBlocks(heights)
    for (const block of blocks) {
      try {
        await scanNormalizedBlock(block.block.block, block.events);
        await updateScanHeight(block.height);
      } catch (e) {
        await sleep(0);
        logger.error(`Error with block scan ${block.height}`, e);
      }
    }

    const lastHeight = last(blocks || [])?.height
    logger.info(`${lastHeight} scan finished! - known height scan`)
    heights = await getNextKnownHeights(lastHeight + 1);
  }
}

module.exports = {
  scanKnownHeights,
}
