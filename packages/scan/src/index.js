require("dotenv").config();
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { getApi } = require("./api");
const { updateHeight } = require("./chain/latestHead");
const { deleteDataFrom } = require("./clean");
const { getLatestHeight } = require("./chain/latestHead");
const { sleep, logger, knownHeightsLogger } = require("./utils");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./events");
const { knownHeights, maxKnownHeight } = require("./block/known");

async function scanKnowBlocks(toScanHeight) {
  let index = knownHeights.findIndex((height) => height >= toScanHeight);
  while (index < knownHeights.length) {
    const height = knownHeights[index];
    await scanBlockByHeight(height);
    await updateScanHeight(height);
    index++;
  }
}

async function main() {
  await updateHeight();
  let scanHeight = await getNextScanHeight();
  await deleteDataFrom(scanHeight);

  const useKnowHeights = !!process.env.USE_KNOWN_HEIGHTS;
  if (scanHeight <= maxKnownHeight && useKnowHeights) {
    await scanKnowBlocks(scanHeight);
    scanHeight = maxKnownHeight + 1;
  }

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

  const hasTargetEvents = await handleEvents(
    allEvents,
    blockIndexer,
    block.block.extrinsics
  );
  const hasTargetEx = await handleExtrinsics(
    block.block.extrinsics,
    allEvents,
    blockIndexer
  );
  if (hasTargetEvents || hasTargetEx) {
    knownHeightsLogger.info(scanHeight);
  }

  logger.info(`block ${block.block.header.number.toNumber()} done`);
}

// FIXME: log the error
main().catch(console.error);
