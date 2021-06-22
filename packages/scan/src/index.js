require("dotenv").config();
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { getApi } = require("./api");
const { updateHeight } = require("./chain/latestHead");
const { deleteDataFrom } = require("./clean");
const { getLatestHeight } = require("./chain/latestHead");
const { sleep, logger, knownHeightsLogger } = require("./utils");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./events");
const { processStat } = require("./stats");
const { handleIncomeEvents } = require("./income");
const { getBlocks } = require("./mongo/meta");
const { GenericBlock } = require("@polkadot/types");
const { hexToU8a } = require("@polkadot/util");

let registry;

async function main() {
  await updateHeight();
  let scanHeight = await getNextScanHeight();
  await deleteDataFrom(scanHeight);

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
        console.error(`Error with block scan ${scanHeight}`, e);
        continue;
      }

      scanHeight = block.height + 1;
    }

    logger.info(`block ${targetHeight} done`);
  }
}

async function scanBlock(blockInDb) {
  if (!registry || registry.specVersion.toNumber() !== blockInDb.specVersion) {
    registry = await getRegistryByHeight(blockInDb.height);
  }

  const block = new GenericBlock(registry.registry, hexToU8a(blockInDb.block));
  const allEvents = registry.registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );

  const blockIndexer = getBlockIndexer(block);

  const hasTargetEvents = await handleEvents(
    allEvents,
    blockIndexer,
    block.extrinsics
  );
  const hasTargetEx = await handleExtrinsics(
    block.extrinsics,
    allEvents,
    blockIndexer
  );
  if (hasTargetEvents || hasTargetEx) {
    knownHeightsLogger.info(blockInDb.height);
  }

  await handleIncomeEvents(allEvents, blockIndexer, block.extrinsics);
  await processStat(blockIndexer);
}

async function getRegistryByHeight(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  return await api.getBlockRegistry(blockHash);
}

// FIXME: log the error
main().catch(console.error);
