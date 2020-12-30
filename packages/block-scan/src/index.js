require('dotenv').config();
const { getApi, disconnect } = require('./api')
const { updateHeight, getLatestHeight } = require('./chain')
const { deleteDataFrom } = require("./mongo/delete")
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight")
const { sleep } = require("./utils/sleep")
const { handleBlock } = require("./block")
const { handleExtrinsics } = require("./extrinsic")
const { handleEvents } = require("./event")
const { getBlockIndexer } = require("./block/getBlockIndexer")
const { logger } = require("./logger")

async function main() {
  await updateHeight()

  let scanHeight = await getNextScanHeight()
  await deleteDataFrom(scanHeight)

  while (true) {
    const chainHeight = getLatestHeight();
    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(1000);
      continue;
    }

    await scanBlockByHeight(scanHeight)
    await updateScanHeight(scanHeight++);
  }
}

async function scanBlockByHeight(scanHeight) {
  const api = await getApi()
  const blockHash = await api.rpc.chain.getBlockHash(scanHeight)
  const block = await api.rpc.chain.getBlock(blockHash)
  const blockEvents = await api.query.system.events.at(blockHash)

  await handleBlock(block.block, blockEvents)

  const blockIndexer = getBlockIndexer(block.block)
  await handleExtrinsics(block.block.extrinsics, blockEvents, blockIndexer)
  await handleEvents(blockEvents, blockIndexer, block.block.extrinsics)
  logger.info(`block ${block.block.header.number.toNumber()} done`);
}

main().then(() => console.log('Scan finished'))
  .catch(console.error)
  .finally(cleanUp)

async function cleanUp() {
  await disconnect()
}
