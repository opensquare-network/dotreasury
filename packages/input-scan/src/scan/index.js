const { getNextScanHeight } = require("../mongo/scanHeight");
const last = require("lodash.last");
const { updateScanStatus } = require("../mongo/scanHeight");
const { scanNormalizedBlock } = require("./block");
const { tryCreateStatPoint } = require("../stats");
const {
  chain: {
    getApi,
    getLatestHeight,
    updateSpecs, getMetaScanHeight,
    fetchBlocks,
    getBlockIndexer,
  },
  logger,
  env: { getScanStep, isUseMetaDb },
  utils: { sleep, getHeadUsedInGB },
} = require("@osn/scan-common");

async function beginScan() {
  let scanHeight = await getNextScanHeight();
  while (true) {
    const api = await getApi();
    if (!api.isConnected) {
      console.log("Api not connected, restart process");
      process.exit(0);
    }
    scanHeight = await oneStepScan(scanHeight);
    await sleep(0);
  }
}

async function oneStepScan(startHeight) {
  const chainHeight = getLatestHeight();
  if (startHeight > chainHeight) {
    // Just wait if the to scan height greater than current chain height
    await sleep(3000);
    return startHeight;
  }

  let targetHeight = chainHeight;
  const step = getScanStep();
  if (startHeight + step < chainHeight) {
    targetHeight = startHeight + step;
  }

  if (isUseMetaDb()) {
    if (targetHeight > getMetaScanHeight()) {
      await updateSpecs();
    }
  }

  const heights = [];
  for (let i = startHeight; i <= targetHeight; i++) {
    heights.push(i);
  }
  const blocks = await fetchBlocks(heights);
  if ((blocks || []).length <= 0) {
    await sleep(1000);
    return startHeight;
  }

  for (const block of blocks) {
    // TODO: do following operations in one transaction
    try {
      const seats = await scanNormalizedBlock(block.block, block.events);
      await updateScanStatus(block.height, seats);

      const indexer = getBlockIndexer(block.block);
      await tryCreateStatPoint(indexer);
    } catch (e) {
      await sleep(1000);
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
  logger.info(`${ lastHeight } scan finished!`);
  return lastHeight + 1;
}

module.exports = {
  beginScan,
};
