const last = require("lodash.last");
const { scanNormalizedBlock } = require("./block");
const { updateScanHeight } = require("../mongo/scanHeight");
const { sleep } = require("../utils/sleep");
const { getNextScanHeight } = require("../mongo/scanHeight");
const { getBlockIndexer } = require("../block/getBlockIndexer");
const { tryCreateStatPoint } = require("../stats");
const { getHeadUsedInGB } = require("../utils/memory");
const {
  getApi, logger, env: { getScanStep }, chainHeight: { getLatestHeight },
  specs: { getMetaScanHeight, updateSpecs },
  fetchBlocks,
} = require("@dotreasury/common");

async function beginRoutineScan() {
  let scanHeight = await getNextScanHeight();
  while (true) {
    const api = await getApi();
    if (!api.isConnected) {
      console.log("Api not connected, restart process");
      process.exit(0);
    }
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

    if (targetHeight > getMetaScanHeight()) {
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
        const blockIndexer = getBlockIndexer(block.block);
        await tryCreateStatPoint(blockIndexer);

        await scanNormalizedBlock(block.block, block.events);
        await updateScanHeight(block.height);
      } catch (e) {
        await sleep(3000);
        logger.error(`Error with block scan ${ block.height }`, e);
      } finally {
        if (getHeadUsedInGB() > 1) {
          console.log(
            `${ getHeadUsedInGB() }GB heap used, restart process in case of memory leak`
          );
          process.exit(0);
        }
      }
    }

    const lastHeight = last(blocks || []).height;
    scanHeight = lastHeight + 1;
    logger.info(`${ lastHeight } scan finished!`);
  }
}

module.exports = {
  beginRoutineScan,
};
