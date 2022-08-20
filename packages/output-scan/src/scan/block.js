const { tryCreateStatPoint } = require("../stats");
const { updateScanHeight } = require("../mongo/scanHeight");
const { chain: { getBlockIndexer } } = require("@osn/scan-common");
const { handleEvents } = require("../business/event");
const { handleExtrinsics } = require("../business/extrinsic");

async function handleBlock({ height, block, events }) {
  const blockIndexer = getBlockIndexer(block);
  await tryCreateStatPoint(blockIndexer);

  await handleExtrinsics(block?.extrinsics, events, blockIndexer);
  await handleEvents(events, block?.extrinsics, blockIndexer);

  await updateScanHeight(height);
}

async function scanNormalizedBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, block.extrinsics, blockIndexer);
}

module.exports = {
  scanNormalizedBlock,
  handleBlock,
}
