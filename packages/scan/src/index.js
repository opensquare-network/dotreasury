require("dotenv").config();
const { updateSpecs, getSpecHeights } = require("./mongo/service/specs");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { updateHeight } = require("./chain/latestHead");
const { deleteDataFrom } = require("./clean");
const { getLatestHeight } = require("./chain/latestHead");
const { sleep, logger } = require("./utils");
const last = require("lodash.last");
const { scanNormalizedBlock } = require("./scan/scanNormalized");
const { fetchBlocks } = require("./scan/fetchBlock");

const scanStep = parseInt(process.env.SCAN_STEP) || 100;

async function main() {
  await updateHeight();
  let scanHeight = await getNextScanHeight();
  await deleteDataFrom(scanHeight);
  await updateSpecs();
  const specHeights = getSpecHeights();
  if (specHeights.length <= 0 || specHeights[0] > 1) {
    logger.error("No specHeights or invalid");
    return;
  }

  let counter = 0;

  while (true) {
    const chainHeight = getLatestHeight();
    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(1000);
      continue;
    }

    let targetHeight = chainHeight;
    if (scanHeight + scanStep < chainHeight) {
      targetHeight = scanHeight + scanStep;
    }

    const specHeights = getSpecHeights();
    if (targetHeight > last(specHeights)) {
      await updateSpecs();
    }

    const heights = [];
    for (let i = scanHeight; i <= targetHeight; i++) {
      heights.push(i);
    }

    const blocks = await fetchBlocks(heights);
    if ((blocks || []).length <= 0) {
      await sleep(1000);
      continue;
    }

    for (const block of blocks) {
      // TODO: do following operations in one transaction
      try {
        await scanNormalizedBlock(block.block, block.events);
        await updateScanHeight(block.height);
      } catch (e) {
        console.error(`Error with block scan ${block.height}`, e);
        logger.error(`Error with block scan ${block.height}`, e);
        await sleep(3000);
        process.exit(1)
      }
    }

    const destHeight = blocks[(blocks || []).length - 1].height;
    scanHeight = destHeight + 1;
    counter++;

    if (counter % 500 === 0) {
      // FIXME: this code is for memory leak
      process.exit(0);
    }

    logger.info(`block ${targetHeight} done`);
  }
}

// FIXME: log the error
main().catch(console.error);
