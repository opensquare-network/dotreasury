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
const { getKnownHeights, getMaxKnownHeight } = require("./block/known/index");
const { processStat } = require("./stats");
const { handleIncomeEvents } = require("./income");
const { currentChain } = require("./chain/index");

async function scanKnowBlocks(toScanHeight) {
  const knownHeights = getKnownHeights();
  let index = knownHeights.findIndex((height) => height >= toScanHeight);
  while (index < knownHeights.length) {
    const height = knownHeights[index];
    try {
      await scanBlockByHeight(height);
    } catch (e) {
      await sleep(3000);
      console.error(`Error with known block scan ${height}`, e);
      continue;
    }
    await updateScanHeight(height);
    index++;
  }
}

async function main() {
  await updateHeight();
  let scanHeight = await getNextScanHeight();
  await deleteDataFrom(scanHeight);

  const chain = currentChain();
  const useKnowHeights =
    "kusama" === chain
      ? !!process.env.KSM_USE_KNOWN_HEIGHTS
      : !!process.env.DOT_USE_KNOWN_HEIGHTS;
  const maxKnownHeight = getMaxKnownHeight();
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

    try {
      await scanBlockByHeight(scanHeight);
    } catch (e) {
      await sleep(3000);
      console.error(`Error with block scan ${scanHeight}`, e);
      continue;
    }

    await updateScanHeight(scanHeight++);
  }
}

async function scanBlockByHeight(scanHeight) {
  const api = await getApi();

  let blockHash;
  try {
    blockHash = await api.rpc.chain.getBlockHash(scanHeight);
  } catch (e) {
    console.error("Can not get block hash");
    throw e;
  }

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

  await handleIncomeEvents(allEvents, blockIndexer, block.block.extrinsics);

  await processStat(blockIndexer);

  logger.info(`block ${block.block.header.number.toNumber()} done`);
}

// FIXME: log the error
main().catch(console.error);
