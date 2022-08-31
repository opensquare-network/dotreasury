const { handleEvents } = require("./event");
const {
  chain: { getBlockIndexer },
} = require("@osn/scan-common");
const { updateScanHeight } = require("../mongo/scanHeight");

async function handleBlock({ height, block, events }) {
  const blockIndexer = getBlockIndexer(block);
  await handleEvents(events, block?.extrinsics, blockIndexer);

  await updateScanHeight(height);
}

module.exports = {
  handleBlock,
}
