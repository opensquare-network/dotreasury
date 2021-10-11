const { handleEvents } = require("../business/event");
const { getBlockIndexer } = require("../business/common/block/getBlockIndexer");
const { findRegistry } = require("../chain/specs");
const { GenericBlock } = require("@polkadot/types");

async function scanBlockFromDb(blockInDb) {
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
  await handleEvents(blockEvents, block.extrinsics, blockIndexer);
}

module.exports = {
  scanBlockFromDb,
  scanNormalizedBlock,
}
