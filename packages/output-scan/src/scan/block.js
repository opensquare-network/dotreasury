const { getBlockIndexer } = require("@dotreasury/common");
const { handleEvents } = require("../business/event");
const { handleExtrinsics } = require("../business/extrinsic");

async function scanNormalizedBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, block.extrinsics, blockIndexer);
}

module.exports = {
  scanNormalizedBlock,
}
