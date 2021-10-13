require("dotenv").config();
const { handleEvents } = require("../events");
const { handleExtrinsics } = require("../extrinsic");
const { getBlockIndexer } = require("../block/getBlockIndexer");
const { getApi } = require("../api");
const { getLatestHeight } = require("../chain/latestHead");
const { updateHeight } = require("../chain/latestHead");

async function main() {
  const myArgs = process.argv.slice(2);
  if ((myArgs || []).length <= 0) {
    console.error("Please specify the block height");
    process.exit(1);
  }

  const arg1 = myArgs[0];
  const height = parseInt(arg1);
  if (isNaN(height)) {
    console.error("Wrong block height");
    process.exit(1);
  }

  await updateHeight();
  const api = await getApi();
  const finalizedHeight = getLatestHeight();
  if (height > finalizedHeight) {
    console.error("Block height can not be greater than the finalized height");
    process.exit(1);
  }

  const blockHash = await api.rpc.chain.getBlockHash(height);
  const rawBlock = await api.rpc.chain.getBlock(blockHash);
  const blockEvents = await api.query.system.events.at(blockHash);

  const block = rawBlock.block;
  const blockIndexer = getBlockIndexer(block);

  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, blockIndexer, block.extrinsics);

  process.exit(0)
}

main().catch(console.error);
