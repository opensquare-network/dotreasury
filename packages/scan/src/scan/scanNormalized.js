const { processStat } = require("../stats");
const { handleIncomeEvents } = require("../income");
const { handleEvents } = require("../events");
const { handleExtrinsics } = require("../extrinsic");
const { getBlockIndexer } = require("../block/getBlockIndexer");

async function scanNormalizedBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, blockIndexer, block.extrinsics);

  await handleIncomeEvents(blockEvents, blockIndexer, block.extrinsics);

  await processStat(blockIndexer);
}

module.exports = {
  scanNormalizedBlock,
}
