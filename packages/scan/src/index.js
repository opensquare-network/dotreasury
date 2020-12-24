require("dotenv").config();
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { getApi } = require("./api");
const { updateHeight } = require("./chain/latestHead");
const { deleteDataFrom } = require("./clean");
const { getLatestHeight } = require("./chain/latestHead");
const { sleep, logger } = require("./utils");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleBlock } = require("./block");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./events");

async function main() {
  const api = await getApi();
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

    let blockHash;
    try {
      blockHash = await api.rpc.chain.getBlockHash(scanHeight);
    } catch (e) {
      console.log(e.message); // FIXME: logger
      await sleep(1000);
      continue;
    }

    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);
    await handleBlockAndEvents(block, allEvents);
    await updateScanHeight(scanHeight++);
  }
}

async function handleBlockAndEvents(block, allEvents) {
  const blockIndexer = getBlockIndexer(block.block);

  await handleBlock(block, allEvents);
  logger.info(`block ${block.block.header.number.toNumber()} is saved to db`);

  await handleEvents(allEvents, blockIndexer, block.block.extrinsics);
  await handleExtrinsics(block.block.extrinsics, allEvents, blockIndexer);
}

// FIXME: log the error
main().catch(console.error);
