const last = require("lodash.last");
const { handleEvents } = require("../business/event");
const { handleExtrinsics } = require("../business/extrinsic");
const { getBlockIndexer } = require("../block/getBlockIndexer");
const { findRegistry } = require("../chain/specs");
const { logger } = require("../logger");
const { updateScanHeight } = require("../mongo/scanHeight");
const { getBlocks } = require("../mongo/meta");
const { updateSpecs } = require("../chain/specs");
const { getSpecHeights } = require("../chain/specs");
const { getScanStep } = require("../env");
const { sleep } = require("../utils/sleep");
const { getLatestHeight } = require("../chain/latestHead");
const { getNextScanHeight } = require("../mongo/scanHeight");
const { GenericBlock } = require("@polkadot/types");


async function beginScan() {
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
        await scanBlock(block);
        await updateScanHeight(block.height);
      } catch (e) {
        await sleep(3000);
        logger.error(`Error with block scan ${ block.height }`, e);
      }
    }
  }
}

async function scanBlock(blockInDb) {
  const registry = await findRegistry(blockInDb.height);

  const block = new GenericBlock(registry, blockInDb.block.block);
  const allEvents = registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );

  await scanNormalizedBlock(block, allEvents);
}

async function scanNormalizedBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, block.extrinsics, blockIndexer);
}

module.exports = {
  beginScan,
  scanNormalizedBlock,
}
