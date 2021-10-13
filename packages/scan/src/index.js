require("dotenv").config();
const { updateSpecs, getSpecHeights } = require("./mongo/service/specs");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { getApi } = require("./api");
const { updateHeight } = require("./chain/latestHead");
const { deleteDataFrom } = require("./clean");
const { getLatestHeight } = require("./chain/latestHead");
const { sleep, logger } = require("./utils");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./events");
const { processStat } = require("./stats");
const { handleIncomeEvents } = require("./income");
const { getBlocks } = require("./mongo/meta");
const { GenericBlock } = require("@polkadot/types");
const last = require("lodash.last");
const { setSpecHeights } = require("./mongo/service/specs");
const { findRegistry } = require("./mongo/service/specs");

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
    if (scanHeight + 100 < chainHeight) {
      targetHeight = scanHeight + 100;
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
        logger.error(`Error with block scan ${block.height}`, e);
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
  await handleEvents(blockEvents, blockIndexer, block.extrinsics);

  await handleIncomeEvents(blockEvents, blockIndexer, block.extrinsics);
  await processStat(blockIndexer);
}

async function test() {
  const height = 9626275;
  setSpecHeights([height]);
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  await scanNormalizedBlock(block.block, allEvents);
}

// FIXME: log the error
main().catch(console.error);
// test()
