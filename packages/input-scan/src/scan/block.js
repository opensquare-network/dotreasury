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
  console.log(block)
  const blockIndexer = getBlockIndexer(block);

  console.log(`block ${blockIndexer.blockHeight}`)
}

module.exports = {
  scanBlockFromDb,
  scanNormalizedBlock,
}
