const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { getApi } = require("./api");
const { updateHeight } = require("./chain/latestHead");
const { deleteDataFrom, findNonForkHeight } = require("./rollback");
const { getLatestHeight } = require("./chain/latestHead");
const { sleep } = require("./utils");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleBlock } = require("./block");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./events");

let preBlockHash = null;

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

    if (!blockHash) {
      // Expect not happen
      await sleep(1000);
      continue;
    }

    const block = await api.rpc.chain.getBlock(blockHash);
    if (
      preBlockHash &&
      block.block.header.parentHash.toString("hex") !== preBlockHash
    ) {
      // There is a fork, and we have to rollback
      const nonForkHeight = await findNonForkHeight(scanHeight);
      await updateScanHeight(nonForkHeight);
      scanHeight = nonForkHeight + 1;
      preBlockHash = null;
      await deleteDataFrom(scanHeight);
      continue;
    }

    preBlockHash = block.block.hash.toHex();

    const allEvents = await api.query.system.events.at(blockHash);

    await handleBlockAndEvents(block, allEvents);

    await updateScanHeight(scanHeight++);
  }
}

async function test() {
  const scanHeight = 714498;

  const api = await getApi();
  await deleteDataFrom(scanHeight);
  const blockHash = await api.rpc.chain.getBlockHash(scanHeight);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);
  await handleBlockAndEvents(block, allEvents);
}

async function handleBlockAndEvents(block, allEvents) {
  const blockIndexer = getBlockIndexer(block.block);

  await handleBlock(block, allEvents);
  console.log(`block ${block.block.header.number.toNumber()} is saved to db`);

  await handleEvents(allEvents, blockIndexer, block.block.extrinsics);
  await handleExtrinsics(block.block.extrinsics, allEvents, blockIndexer);
}

// FIXME: log the error
// main().catch(console.error);
test().catch(console.error);
