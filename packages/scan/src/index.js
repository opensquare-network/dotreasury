require("dotenv").config();
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { getApi } = require("./api");
const { updateHeight } = require("./chain/latestHead");
const { deleteDataFrom } = require("./clean");
const { getLatestHeight } = require("./chain/latestHead");
const { sleep, logger } = require("./utils");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./events");
const {
  knownHeights,
  maxKnowHeightWithTreasuryOrProxyExtrinsic,
} = require("./block/knownTreasuryBlocks");
const {
  knownCouncilEventHeights,
  maxKnownCouncilHeight,
} = require("./block/knownCouncilEventBlocks");

async function scanKnowBlocks(toScanHeight) {
  let index = knownHeights.findIndex((height) => height >= toScanHeight);
  while (index < knownHeights.length - 1) {
    const height = knownHeights[index];
    await scanBlockByHeight(height);
    await updateScanHeight(height);
    index++;
  }
}

async function scanCouncilBlocks(toScanHeight) {
  let index = knownCouncilEventHeights.findIndex(
    (height) => height >= toScanHeight
  );
  while (index < knownCouncilEventHeights.length - 1) {
    const height = knownCouncilEventHeights[index];
    await scanBlockByHeight(height);
    await updateScanHeight(height);
    index++;
  }
}

async function main() {
  await updateHeight();
  let scanHeight = await getNextScanHeight();
  await deleteDataFrom(scanHeight);

  // const maxHeight = maxKnowHeightWithTreasuryOrProxyExtrinsic
  const maxHeight = maxKnownCouncilHeight;
  if (scanHeight < maxHeight) {
    // await scanKnowBlocks(scanHeight);
    await scanCouncilBlocks(scanHeight);
  }
  scanHeight = maxHeight + 1;

  while (true) {
    const chainHeight = getLatestHeight();
    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(1000);
      continue;
    }

    await scanBlockByHeight(scanHeight);
    await updateScanHeight(scanHeight++);
  }
}

async function scanBlockByHeight(scanHeight) {
  const api = await getApi();

  const blockHash = await api.rpc.chain.getBlockHash(scanHeight);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  const blockIndexer = getBlockIndexer(block.block);

  await handleEvents(allEvents, blockIndexer, block.block.extrinsics);
  // await handleExtrinsics(block.block.extrinsics, allEvents, blockIndexer);
  logger.info(`block ${block.block.header.number.toNumber()} done`);
}

// FIXME: log the error
main().catch(console.error);
