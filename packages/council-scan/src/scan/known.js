const { updateScanHeight } = require("../mongo/scanHeight");
const { handleBlock } = require("./block");
const { getNextKnownHeights } = require("../mongo/knownHeight");
const { getNextScanHeight } = require("../mongo/scanHeight");
const {
  logger,
  chain: { fetchBlocks },
  utils: { sleep },
} = require("@osn/scan-common");
const last = require("lodash.last");

let count = 0;
async function scanKnownHeights() {
  const toScanHeight = await getNextScanHeight();
  let heights = await getNextKnownHeights(toScanHeight);

  while (heights.length > 0) {
    const blocks = await fetchBlocks(heights);
    for (const block of blocks) {
      try {
        await handleBlock(block);
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
